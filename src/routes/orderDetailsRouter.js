const express = require('express');
const router = express.Router();
const OrderDetailsController = require('../app/controller/OrderDetailsController');
router.get('/:id', OrderDetailsController.renderOrdersDetail);
router.post('/cancel/:id', OrderDetailsController.cancelOrder);
module.exports = router;
