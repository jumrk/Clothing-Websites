const express = require('express')
const router = express.Router();
const paymentController = require('../app/controller/PaymentController')
const { isAuthenticated, checkLoginStatus } = require('../middleware/authMiddleware');

router.post('/applyVoucher', isAuthenticated, paymentController.applyVoucher)
router.post('/process-payment', isAuthenticated, paymentController.processPayment);
router.get('/', isAuthenticated, paymentController.renderPayment)
module.exports = router;