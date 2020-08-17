const express = require('express')
const router = express.Router()
const PostController = require('../controllers/PostController')
const requireLogin = require('../middleware/requireLogin')

router.get('/posts', requireLogin, PostController.index )
router.get('/posts/subscribe', requireLogin, PostController.subscribePost)
router.post('/posts', requireLogin, PostController.store)
router.get('/myposts', requireLogin, PostController.mypost)
router.put('/like', requireLogin, PostController.like)
router.put('/unlike', requireLogin, PostController.unlike)
router.put('/comment', requireLogin, PostController.comment)
router.delete('/posts/:postId', requireLogin, PostController.destroy)
router.put('/posts/comment', requireLogin, PostController.destroyComment)


module.exports = router