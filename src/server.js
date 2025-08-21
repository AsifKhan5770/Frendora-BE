const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/db')
const postRoutes = require('./routes/postRoutes')
const userRoutes = require('./routes/userRoutes')

dotenv.config()
connectDB()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Backend Running...');
});

app.use('/api/posts', postRoutes)
app.use('/api/users', userRoutes)

const PORT = process.env.PORT || 3002
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));