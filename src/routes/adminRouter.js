const express = require('express');
const router = express.Router();
const adminController = require('../app/controller/AdminController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'src/uploads/' });

// render
router.get('/Dash-board', isAuthenticated, isAdmin, adminController.renderDashboard);
router.get('/users', isAuthenticated, isAdmin, adminController.renderUsers);
router.get('/products', isAuthenticated, isAdmin, adminController.renderProducts);
router.get('/orders', isAuthenticated, isAdmin, adminController.renderOrders);
router.get('/orders/orderDetail/:id', isAuthenticated, isAdmin, adminController.renderOrderDetail);
router.get('/vouchers', isAuthenticated, isAdmin, adminController.renderVouchers);
router.get('/products/editProduct/:id', isAuthenticated, isAdmin, adminController.renderFormEditProduct);
router.get('/products/addProduct', isAuthenticated, isAdmin, adminController.renderFormAddProduct);

// add
router.post('/products/addProduct/post', upload.single('imgProduct'), isAuthenticated, isAdmin, adminController.addProduct)

// delete
router.delete('/users/:id', isAuthenticated, isAdmin, adminController.deleteUser);
router.delete('/products/:id', isAuthenticated, isAdmin, adminController.deleteProduct);

// edit 
router.put('/products/editProduct/:id', upload.single('imgProduct'), isAuthenticated, isAdmin, adminController.editProduct)
router.put('/orders/:id/update-status', adminController.updateOrderStatus);

module.exports = router;
