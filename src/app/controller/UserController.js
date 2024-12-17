const User = require('../models/User');
const Address = require('../models/address');
const Order = require('../models/order');
const { mongooseToObject } = require('../../util/mongoose');
class UserController {
    async renderUser(req, res, next) {
        const userId = req.user.id;

        try {
            const user = await User.findOne({ _id: userId }).lean(); // Lấy thông tin người dùng
            const addresses = await Address.find({ userID: userId }).lean(); // Lấy danh sách địa chỉ
            const orders = await Order.find({ userId, deleteAt: null }).lean(); // Lấy danh sách đơn hàng của người dùng

            // Kết hợp tên người dùng vào địa chỉ
            const addressData = addresses.map((address) => ({
                ...address,
                nameUser: user.nameUser
            }));

            // Render dữ liệu ra view
            res.render('page/user', {
                user,
                address: addressData,
                orders,
                layout: 'main',
                title: 'Thông tin người dùng'
            });
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu người dùng:", error);
            res.status(500).send('Có lỗi xảy ra khi lấy thông tin người dùng.');
        }
    }

    update(req, res, next) {
        User.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/user'))
            .catch(next)
    }
    createAddreee(req, res, next) {
        const address = new Address(req.body)
        address.save()
            .then(() => {
                res.redirect('/user')
            })
            .catch(next)
    };
    updateAddress(req, res, next) {
        const { id } = req.params;
        const { address } = req.body;

        Address.updateOne({ _id: id }, { $set: { address: address } })
            .then(() => {
                res.json({ success: true, message: 'Cập nhật thành công' });
            })
            .catch(err => {
                res.status(500).json({ success: false, message: 'Lỗi khi cập nhật' });
            });
    };
    deleteAddress(req, res, next) {
        const { id } = req.params;
        Address.findByIdAndDelete(id)
            .then(() => {
                res.redirect('/user');
            })
            .catch(next);
    };
    async renderOrderHistory(req, res, next) {
        try {
            const idUser = req.user.id;
            let orders = await Order.find({ userId: idUser, deleteAt: { $ne: null } });
            orders = orders.map(order => order.toObject());
            res.render('page/orderHistory', { orders, layout: 'auth', title: "Lịch sử mua hàng" })
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
            res.status(500).send('Có lỗi xảy ra khi lấy thông tin sản phẩm.');
        }

    }


}
module.exports = new UserController