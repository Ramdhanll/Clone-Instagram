const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/AuthController')
// const requireLogin = require('../middleware/requireLogin')

router.post('/signup', AuthController.signup)
router.post('/signin', AuthController.signin)
router.post('/reset-password', AuthController.resetPassword)
router.post('/new-password', AuthController.newPassword)

module.exports = router 