const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Determine storage type based on environment
let storage;

try {
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL === '1') {
    // Use Cloudinary for production/Vercel
    const { CloudinaryStorage } = require('multer-storage-cloudinary');
    const cloudinary = require('../config/cloudinary');
    
    storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'frendora-uploads',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'avi'],
        transformation: [
          { width: 1000, height: 1000, crop: 'limit' }, // Resize large images
          { quality: 'auto:good' } // Optimize quality
        ]
      }
    });
    console.log('☁️ Using Cloudinary storage for production');
  } else {
    // Use local storage for development
    const uploadsDir = path.join(__dirname, '../../uploads');
    
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, uploadsDir);
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
        cb(null, filename);
      }
    });
    console.log('📁 Using local storage for development');
  }
} catch (error) {
  console.error('❌ Error setting up storage:', error);
  console.log('📁 Falling back to local storage');
  
  // Fallback to local storage
  const uploadsDir = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
      cb(null, filename);
    }
  });
}

// File filter to allow images and videos
const fileFilter = (req, file, cb) => {
  // Check file type - allow images and videos
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    const error = new Error('Only image and video files are allowed!');
    error.code = 'INVALID_FILE_TYPE';
    cb(error, false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 5 // Maximum 5 files
  }
});

module.exports = upload;
