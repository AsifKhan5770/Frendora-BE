const express = require('express');
const router = express.Router();
const multer = require('multer');
const postController = require('../controllers/postController');
const auth = require('../middleware/auth'); // ✅ Import auth middleware
const upload = require('../middleware/upload'); // Import upload middleware

// Public Routes - Specific routes first (before parameterized routes)
router.get('/search', postController.searchposts);
router.get('/', postController.getposts);
router.get('/:id', postController.getpostById);

// ✅ Protected Routes
router.post('/', auth, upload.array('media', 5), postController.createpost);
router.put('/:id', auth, upload.array('media', 5), postController.updatepost);
router.delete('/:id', auth, postController.deletepost);

// Error handling for Multer file upload errors
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    console.error('Multer error:', error);
    
    let message = 'File upload error';
    let statusCode = 400;
    
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        message = 'File size too large. Maximum size is 10MB per file.';
        statusCode = 413; // Payload Too Large
        break;
      case 'LIMIT_FILE_COUNT':
        message = 'Too many files. Maximum 5 files allowed.';
        statusCode = 413;
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Unexpected file field.';
        statusCode = 400;
        break;
      default:
        message = `File upload error: ${error.message}`;
        statusCode = 400;
    }
    
    return res.status(statusCode).json({ 
      success: false,
      message: message,
      error: error.code,
      timestamp: new Date().toISOString()
    });
  }
  
  // Handle custom file type errors
  if (error.code === 'INVALID_FILE_TYPE') {
    console.error('File type error:', error);
    return res.status(400).json({
      success: false,
      message: error.message,
      error: 'INVALID_FILE_TYPE',
      timestamp: new Date().toISOString()
    });
  }
  
  // Pass other errors to the main error handler
  next(error);
});

module.exports = router;