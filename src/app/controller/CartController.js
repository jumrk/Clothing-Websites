const Cart = require('../models/cart');
const Voucher = require('../models/voucher')
const { mongooseToObject } = require('../../util/mongoose');
const { checkLoginStatus } = require('../../middleware/authMiddleware');
const voucher = require('../models/voucher');
class CartController {
    addCart(req, res, next) {
        const idUser = req.user.id;
        if (idUser) {
            const productId = req.params.id;
            const { quantityCart, sizeCart, colorCart, priceProduct } = req.body;
            const totalCart = parseInt(quantityCart) * parseInt(priceProduct);
            const carts = {
                idProduct: productId,
                idUser: idUser,
                quantityCart: quantityCart,
                totalCart: totalCart,
                sizeCart: sizeCart,
                colorCart: colorCart
            }
            const cart = new Cart(carts);
            cart.save()
                .then(() => {
                    res.redirect("/cart")
                })
                .catch(next)
        }

    }
    async renderCart(req, res, next) {
        try {
            const userId = req.user.id;
            let carts = await Cart.find({ idUser: userId }).populate('idProduct');
            let vouchers = await Voucher.find({})
            carts = carts.map(cart => cart.toObject());
            vouchers = vouchers.map(voucher => voucher.toObject());
            let totalAmount = 0;
            carts.forEach(cart => {
                totalAmount += parseFloat(cart.totalCart);
            });

            res.render('page/cart', {
                carts,
                totalAmount,
                vouchers,
                checkLoginStatus,
                layout: 'main',
                title: 'Giỏ hàng'
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Lỗi khi lấy dữ liệu giỏ hàng');
        }
    }


    // Tăng số lượng sản phẩm trong giỏ hàng
    async increase(req, res, next) {
        const cartId = req.params.id;
        try {
            const cart = await Cart.findById(cartId).populate('idProduct');
            if (!cart || !cart.idProduct) {
                return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại trong giỏ hàng.' });
            }

            cart.quantityCart = parseInt(cart.quantityCart) + 1;
            cart.totalCart = cart.quantityCart * Number(cart.idProduct.priceProduct);
            await cart.save();

            res.json({
                success: true,
                newQuantity: cart.quantityCart,
                newTotal: cart.totalCart,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Lỗi khi cập nhật giỏ hàng.' });
        }
    }

    // Giảm số lượng sản phẩm trong giỏ hàng
    async decrease(req, res, next) {
        const cartId = req.params.id;
        try {
            const cart = await Cart.findById(cartId).populate('idProduct');
            if (!cart || !cart.idProduct) {
                return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại trong giỏ hàng.' });
            }

            if (cart.quantityCart > 1) {
                cart.quantityCart = parseInt(cart.quantityCart) - 1;
                cart.totalCart = cart.quantityCart * Number(cart.idProduct.priceProduct);
                await cart.save();

                res.json({
                    success: true,
                    newQuantity: cart.quantityCart,
                    newTotal: cart.totalCart,
                });
            } else {
                res.status(400).json({ success: false, message: 'Số lượng phải lớn hơn 0.' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Lỗi khi cập nhật giỏ hàng.' });
        }
    }

    async deleteCart(req, res, next) {
        const cartId = req.params.id;
        try {
            const cart = await Cart.findByIdAndDelete(cartId);
            if (!cart) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
            }
            res.json({ success: true, message: 'Sản phẩm đã được xóa khỏi giỏ hàng' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng' });
        }
    }

}

module.exports = new CartController();