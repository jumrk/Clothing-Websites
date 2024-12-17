const express = require('express')
const router = express.Router();
const loginController = require('../app/controller/AuthController')
router.get('/login', loginController.login)
router.post('/store', loginController.store)
router.post('/getStore', loginController.getStore)
router.get('/register', loginController.register)
router.get('/logout', loginController.logout)
module.exports = router;