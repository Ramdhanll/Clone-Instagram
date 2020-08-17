const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
const requireLogin = require('../middleware/requireLogin')

router.get('/user/:id', requireLogin, UserController.show)
router.put('/follow', requireLogin, UserController.follow)
router.put('/unfollow', requireLogin, UserController.unfollow)
router.put('/user/update-photo', requireLogin, UserController.updatePhoto)

module.exports = router