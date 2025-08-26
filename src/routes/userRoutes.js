const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth'); // ✅ Import auth middleware

// Public Routes
router.post('/', userController.createuser);
router.post('/login', userController.loginuser);
router.get('/search', userController.searchusers);

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