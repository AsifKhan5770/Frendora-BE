const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')

router.post('/', postController.createpost)
router.get('/', postController.getposts)
router.get('/search', postController.searchposts)
router.get('/:id', postController.getpostById)
router.put('/:id', postController.updatepost)
router.delete('/:id', postController.deletepost)

module.exports = router