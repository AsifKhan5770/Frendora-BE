const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth'); // ✅ Import auth middleware

// Public Routes
router.get('/', postController.getposts);
router.get('/search', postController.searchposts);
router.get('/:id', postController.getpostById);

// ✅ Protected Routes
router.post('/', auth, postController.createpost);
router.put('/:id', auth, postController.updatepost);
router.delete('/:id', auth, postController.deletepost);

module.exports = router;