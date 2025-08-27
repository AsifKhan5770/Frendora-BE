const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth'); // ✅ Import auth middleware

// Public Routes - Only registration and login should be public
router.post('/', userController.createuser);
router.post('/login', userController.loginuser);

// Protected Routes - User search requires authentication
router.get('/search', auth, userController.searchusers);

// ✅ Protected Routes
router.get('/', auth, userController.getusers);
router.get('/:id', auth, userController.getuserById);
router.put('/:id', auth, userController.updateuser);
router.delete('/:id', auth, userController.deleteuser);

// Profile Routes (Protected)
router.get('/profile/:id', auth, userController.getProfile);
router.put('/profile/:id/name', auth, userController.updateName);
router.put('/profile/:id/password', auth, userController.changePassword);

module.exports = router;