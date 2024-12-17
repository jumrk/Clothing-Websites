const express = require('express')
const router = express.Router();
const forgotPasswordController = require('../app/controller/ForgotPasswordController')
const { isAuthenticated, checkLoginStatus } = require('../middleware/authMiddleware');

router.get('/', forgotPasswordController.renderForgotPassword)
router.post('/sendCode', forgotPasswordController.sendResetCode)
router.post('/verifyCode', forgotPasswordController.verifyResetCode)
router.post('/ressetPassword',forgotPasswordController.resetPassword)
module.exports = router;