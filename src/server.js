const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/db')
const postRoutes = require('./routes/postRoutes')
const userRoutes = require('./routes/userRoutes')

dotenv.config()

// Check if required environment variables exist
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI environment variable is required!');
  console.error('Please create a .env file with your MongoDB connection string.');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET environment variable is required!');
  console.error('Please create a .env file with your JWT secret.');
  process.exit(1);
}

// Connect to database
connectDB()

const app = express()
// CORS configuration for Vercel deployment
app.use(cors({
  origin: [
    'https://frendora-fe.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))
app.use(express.json())
// Ensure uploads directory exists
const fs = require('fs');
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory:', uploadsDir);
}

app.use('/uploads', express.static(uploadsDir)) // Serve uploaded images

app.get('/', (req, res) => {
  res.send('Backend Running...');
});

// Test endpoint to check if server is working
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

// Test database connection
app.get('/test-db', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const status = mongoose.connection.readyState;
    const statusText = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    res.json({ 
      message: 'Database connection test',
      status: statusText[status],
      readyState: status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Database test failed',
      error: error.message 
    });
  }
});

// Test upload directory
app.get('/test-upload', (req, res) => {
  try {
    const fs = require('fs');
    const uploadsDir = path.join(__dirname, '../uploads');
    const exists = fs.existsSync(uploadsDir);
    const stats = exists ? fs.statSync(uploadsDir) : null;
    
    res.json({ 
      message: 'Upload directory test',
      uploadsDir: uploadsDir,
      exists: exists,
      isDirectory: exists ? stats.isDirectory() : false,
      writable: exists ? (stats.mode & fs.constants.W_OK) !== 0 : false,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Upload directory test failed',
      error: error.message 
    });
  }
});

// Test endpoint to check request parsing
app.post('/test-request', (req, res) => {
  res.json({
    message: 'Request received',
    body: req.body,
    headers: req.headers,
    timestamp: new Date().toISOString()
  });
});

app.use('/api/posts', postRoutes)
app.use('/api/users', userRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
      error: 'Invalid ID provided',
      timestamp: new Date().toISOString()
    });
  }
  
  if (err.code === 11000) { // MongoDB duplicate key error
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry',
      error: 'This record already exists',
      timestamp: new Date().toISOString()
    });
  }
  
  // Default error response
  res.status(500).json({ 
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));