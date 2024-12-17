const express = require('express')
const router = express.Router();
const aboutUsController = require('../app/controller/AboutUsController')
const { isAuthenticated, checkLoginStatus } = require('../middleware/authMiddleware');
router.get('/', checkLoginStatus, aboutUsController.renderAboutUs);
module.exports = router;