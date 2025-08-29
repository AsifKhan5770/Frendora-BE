const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth'); // ✅ Import auth middleware
const upload = require('../middleware/upload');

// Public Routes - Only registration and login should be public
router.post('/', userController.createuser);
router.post('/login', userController.loginuser);

// ✅ Protected Routes - Specific routes first (before parameterized routes)
router.get('/search', auth, userController.searchusers);
router.get('/profile/:id', auth, userController.getProfile);
router.put('/profile/:id/name', auth, userController.updateName);
router.put('/profile/:id/password', auth, userController.changePassword);
router.post('/profile/:id/avatar', auth, upload.single('avatar'), userController.uploadAvatar);
router.delete('/profile/:id/avatar', auth, userController.deleteAvatar);

// General protected routes (parameterized routes last)
router.get('/', auth, userController.getusers);
router.get('/:id', auth, userController.getuserById);
router.put('/:id', auth, userController.updateuser);
router.delete('/:id', auth, userController.deleteuser);

module.exports = router;