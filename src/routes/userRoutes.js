const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.post('/', userController.createuser)
router.post('/login', userController.loginuser)
router.get('/', userController.getusers)
router.get('/search', userController.searchusers)
router.get('/:id', userController.getuserById)
router.put('/:id', userController.updateuser)
router.delete('/:id', userController.deleteuser)

// profile routes
router.get('/profile/:id', userController.getProfile)
router.put('/profile/:id/name', userController.updateName)
router.put('/profile/:id/password', userController.changePassword)

module.exports = router