const Order = require('../models/order')
const OrderDetail = require('../models/orderDetails')
const Product = require('../models/Product')
class OrderDetailsController {
    async renderOrdersDetail(req, res, next) {
        const id = req.params.id; // Lấy ID đơn hàng từ URL
        console.log(id)
        try {
            const order = await Order.findById(id).lean();
            const orderDetails = await OrderDetail.find({ orderId: id })
                .populate('productId')
                .lean();

            if (!order) {
                return res.status(404).send('Đơn hàng không tồn tại.');
            }


            if (order.deleteAt == null) {
                res.render('page/ordersDetail', {
                    order,
                    orderDetails,
                    layout: 'auth',
                    title: `Chi tiết đơn hàng - ${id}`
                });
            } else {
                res.render('page/ordersDetailHistory', {
                    order,
                    orderDetails,
                    layout: 'auth',
                    title: `Chi tiết đơn hàng - ${id}`
                });
            }


        } catch (error) {
            console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
            res.status(500).send('Có lỗi xảy ra khi lấy chi tiết đơn hàng.');
        }
    }
    async cancelOrder(req, res, next) {
        const orderId = req.params.id;

        try {
            const order = await Order.findById(orderId);

            if (!order) {
                return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng." });
            }

            // Kiểm tra tình trạng đơn hàng
            if (order.status === "Đang vận chuyển") {
                return res.status(400).json({
                    success: false,
                    message: "Đơn hàng đang vận chuyển không thể hủy."
                });
            }

            // Lấy danh sách sản phẩm trong chi tiết đơn hàng
            const orderDetails = await OrderDetail.find({ orderId });

            // Cập nhật số lượng sản phẩm trong kho
            for (const detail of orderDetails) {
                const product = await Product.findById(detail.productId);

                if (product) {
                    product.quantityProduct += detail.quantity; // Trả lại số lượng đã mua
                    await product.save();
                }
            }

            // Gắn thuộc tính `deleteAt` và cập nhật trạng thái
            order.deleteAt = new Date();
            order.status = 'Đã hủy';
            await order.save();

            res.json({ success: true, message: "Đơn hàng đã được hủy thành công." });
        } catch (error) {
            console.error("Lỗi khi hủy đơn hàng:", error);
            res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi hủy đơn hàng." });
        }
    }
}

module.exports = new OrderDetailsController();
