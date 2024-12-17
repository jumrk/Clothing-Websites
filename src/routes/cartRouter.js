const express = require('express')
const router = express.Router();
const cartController = require('../app/controller/CartController')
const { isAuthenticated, checkLoginStatus } = require('../middleware/authMiddleware');

router.get('/', isAuthenticated, checkLoginStatus, cartController.renderCart)
router.post('/addCart/:id', isAuthenticated, cartController.addCart)
router.patch('/increase/:id', cartController.increase)
router.patch('/decrease/:id', cartController.decrease)
router.delete('/deleteCart/:id', cartController.deleteCart)
module.exports = router;