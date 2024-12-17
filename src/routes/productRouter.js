const express = require('express');
const router = express.Router();
const productController = require('../app/controller/Product')
const { isAuthenticated, checkLoginStatus } = require('../middleware/authMiddleware');

router.get('/', checkLoginStatus, productController.product)
router.get('/categories/:cate', checkLoginStatus, productController.renderCategories)
router.get('/:slug', checkLoginStatus, productController.produtDetails);
module.exports = router