const Address = require('../models/address');
const User = require('../models/User')
const Cart = require('../models/cart');
const Voucher = require('../models/voucher');
const Order = require('../models/order');
const OrderDetail = require('../models/orderDetails')
const { mongooseToObject } = require('../../util/mongoose');
class PaymentController {

    async renderPayment(req, res, next) {
        const idUser = req.user.id;

        try {
            let address = await Address.find({ userID: idUser });
            address = address.map(addres => addres.toObject());

            let carts = await Cart.find({ idUser: idUser }).populate('idProduct');
            carts = carts.map(cart => cart.toObject());

            let totalProduct = 0;
            carts.forEach(cart => {
                totalProduct += cart.totalCart ? parseFloat(cart.totalCart) : (cart.quantityCart * cart.idProduct.priceProduct);
            });

            const shippingFee = 50;
            const total = totalProduct + shippingFee;

            const users = await User.findOne({ _id: idUser });

            res.render('page/payment', {
                users: mongooseToObject(users),
                carts,
                address,
                totalProduct,
                total,
                layout: "auth",
                title: "Thanh toán đơn hàng"
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Lỗi khi xử lý yêu cầu');
        }
    }

    async applyVoucher(req, res, next) {
        const { codeVoucher } = req.body;
        const userId = req.user.id;

        try {
            const voucher = await Voucher.findOne({ codeVoucher: codeVoucher });
            if (!voucher) {
                // Nếu không tìm thấy voucher, trả về thông báo lỗi
                return res.status(400).json({ success: false, message: "Mã giảm giá không chính xác" });
            }

            let carts = await Cart.find({ idUser: userId }).populate('idProduct');
            carts = carts.map(cart => cart.toObject());

            let totalProduct = 0;
            carts.forEach(cart => {
                totalProduct += cart.totalCart
                    ? parseFloat(cart.totalCart)
                    : (cart.quantityCart * cart.idProduct.priceProduct);
            });

            // Kiểm tra điều kiện áp dụng mã giảm giá
            const condition = parseFloat(voucher.conditionVoucher); // Điều kiện từ model Voucher
            if (totalProduct < condition) {
                return res.status(400).json({
                    success: false,
                    message: `Mã giảm giá chỉ áp dụng cho đơn hàng từ ${condition}k trở lên.`
                });
            }

            // Tính tổng sau giảm giá
            const discountValue = parseFloat(voucher.valueVoucher);
            const totalAfterDiscount = totalProduct - discountValue;
            const shippingFee = 50; // Phí ship mặc định
            const total = totalAfterDiscount + shippingFee;

            res.json({
                success: true,
                newTotal: total,
                discount: discountValue,
                message: "Mã giảm giá áp dụng thành công!"
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Lỗi khi áp dụng mã giảm giá" });
        }
    }

    async processPayment(req, res, next) {
        const { address, phone, paymentMethod, totalPrice } = req.body;
        const userId = req.user.id;
        try {
            // Kiểm tra điều kiện nhập
            if (!address || !phone || !paymentMethod) {
                return res.status(400).json({
                    success: false,
                    message: "Vui lòng cung cấp đầy đủ thông tin giao hàng và phương thức thanh toán."
                });
            }

            const carts = await Cart.find({ idUser: userId }).populate('idProduct');
            for (const cart of carts) {
                const product = cart.idProduct;
                if (product.quantityProduct < cart.quantityCart) {
                    return res.status(400).json({
                        success: false,
                        message: `Sản phẩm "${product.nameProduct}" không đủ số lượng trong kho. Hiện tại chỉ còn ${product.quantityProduct}.`
                    });
                }
            }

            // Tạo đơn hàng
            const newOrder = await Order.create({
                userId,
                address,
                phone,
                paymentMethod,
                totalPrice,
                status: "Đang xác nhận"
            });

            // Tạo chi tiết đơn hàng và giảm số lượng sản phẩm trong kho
            for (const cart of carts) {
                const product = cart.idProduct;

                // Trừ số lượng sản phẩm trong kho
                product.quantityProduct -= cart.quantityCart;
                await product.save();

                // Tạo chi tiết đơn hàng
                await OrderDetail.create({
                    orderId: newOrder._id,
                    productId: product._id,
                    quantity: cart.quantityCart,
                    price: product.priceProduct,
                    total: cart.totalCart || (cart.quantityCart * product.priceProduct)
                });
            }

            // Xóa giỏ hàng sau khi đặt hàng thành công
            await Cart.deleteMany({ idUser: userId });

            res.json({
                success: true,
                message: "Thanh toán thành công. Đơn hàng của bạn đang được xử lý."
            });
        } catch (error) {
            console.error("Lỗi khi xử lý thanh toán:", error);
            res.status(500).json({ success: false, message: "Có lỗi xảy ra khi thanh toán." });
        }
    }

}

module.exports = new PaymentController();