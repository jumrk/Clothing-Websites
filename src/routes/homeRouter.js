const express = require('express');
const router = express.Router();
const homeController = require('../app/controller/HomeController')
const { isAuthenticated, checkLoginStatus } = require('../middleware/authMiddleware');
router.get('/', checkLoginStatus, homeController.home)

module.exports = router;