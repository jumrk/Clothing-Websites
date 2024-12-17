const express = require('express');
const router = express.Router();
const userController = require('../app/controller/userController')
const { isAuthenticated, checkLoginStatus } = require('../middleware/authMiddleware');

router.get('/', isAuthenticated, checkLoginStatus, userController.renderUser)
router.put('/:id', userController.update)
router.post('/createAddreee', userController.createAddreee)
router.post('/updateAddress/:id', userController.updateAddress)
router.get('/deleteAddress/:id', userController.deleteAddress)
router.get('/orderHistory',isAuthenticated,userController.renderOrderHistory)
module.exports = router