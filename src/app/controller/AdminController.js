const User = require('../models/User');
const Cart = require('../models/cart');
const Product = require('../models/Product');
const Order = require('../models/order');
const orderDetail = require('../models/orderDetails');
const Voucher = require('../models/voucher');
const { mongooseToObject } = require('../../util/mongoose');
class AdminController {
    async renderDashboard(req, res, next) {
        try {
            const Dashboard = 'hovered';
            const userLength = await User.countDocuments({});
            const orderLength = await Order.countDocuments({});
            const productLength = await Product.countDocuments({});
            const orders = await Order.find({});
            const total = orders.reduce((sum, order) => sum + order.totalPrice, 0);
            const formattedTotal = total.toLocaleString('vi-VN');
            const latestUsers = await User.find({}).sort({ createdAt: -1 }).limit(6);
            const latestUsersObjects = latestUsers.map(user => user.toObject());
            const latestOrders = await Order.find({}).sort({ createdAt: -1 }).limit(6);
            const latestOrdersObjects = latestOrders.map(order => order.toObject());

            res.render('Admin/adminDashboard', {
                userLength,
                orderLength,
                productLength,
                formattedTotal,
                latestUsersObjects,
                latestOrdersObjects,
                Dashboard, title: 'Admin', layout: 'admin'
            });

        } catch (error) {
            console.error('Lỗi không thể lấy data', error);
            next(error);
        }
    }
    renderUsers(req, res, next) {
        const classUsers = 'hovered';
        User.find({})
            .then((user) => {
                user = user.map(users => users.toObject());
                res.render('Admin/adminUsers', { user, classUsers, title: 'Admin', layout: 'admin' })
            })

    }

    async deleteUser(req, res, next) {
        const userId = req.params.id;
        try {
            const user = await User.findByIdAndDelete(userId);
            if (!user) {
                return res.status(400).json({ success: false, message: 'Người dùng không thể xóa' });
            }
            await Cart.deleteMany({ idUser: userId });
            res.json({ success: true, message: 'Xóa người dùng thành công.' });
        } catch (error) {
            console.error('Lỗi khi xóa người dùng', error);
            res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi xóa người dùng" })
        }
    };
    // product
    renderProducts(req, res, next) {
        const classProducts = 'hovered';
        Product.find({})
            .then((products) => {
                products = products.map(product => product.toObject());
                res.render('Admin/adminProducts', { products, classProducts, title: 'Admin', layout: 'admin' })
            })
    }
    renderFormAddProduct(req, res, next) {
        res.render('Admin/Form/Form-add-product', { layout: 'boostrap' })
    }
    async addProduct(req, res, next) {

        try {
            const {
                nameProduct,
                categoriesProduct,
                brandProduct,
                priceProduct,
                quantityProduct,
                detailProduct,
            } = req.body;
            const colorProduct = JSON.parse(req.body.colorProduct);
            const sizeProduct = JSON.parse(req.body.sizeProduct);

            // Lưu ảnh sản phẩm
            const imageProduct = req.file ? `/uploads/${req.file.filename}` : '';
            const slug = nameProduct
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            const newProduct = new Product({
                nameProduct,
                categories: categoriesProduct,
                brandName: brandProduct,
                priceProduct,
                quantityProduct,
                colorProduct,
                sizeProduct,
                descriptionProduct: detailProduct,
                imageProduct,
                slug,
            });
            await newProduct.save();
            res.json({ success: true, message: 'Sản phẩm đã được thêm thành công.' });
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
            res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi thêm sản phẩm.' });
        }

    }
    async deleteProduct(req, res, next) {
        const productId = req.params.id;
        try {
            const product = await Product.findByIdAndDelete(productId);
            if (!product) {
                return res.status(400).json({ success: false, message: 'Sản phẩm không thể xóa' })
            }
            await Cart.deleteMany({ idProduct: productId });
            res.json({ success: true, message: 'Xóa sản phẩm thành công' });
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm', error);
            res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi xóa sản phẩm" })
        }
    }
    renderFormEditProduct(req, res, next) {
        const productId = req.params.id;
        const classProducts = 'hovered';
        Product.findById(productId)
            .then((product) => {
                res.render('Admin/Form/Form-edit-product', { products: mongooseToObject(product), classProducts, title: 'Admin', layout: 'boostrap' })
            })
    }
    async editProduct(req, res) {
        try {
            const productId = req.params.id;
            const {
                nameProduct,
                categoriesProduct,
                brandProduct,
                priceProduct,
                quantityProduct,
                detailProduct,
                color,
                size,
            } = req.body;

            const currentImage = req.body.currentImage;
            let imageProduct = currentImage;
            if (req.file) {
                imageProduct = `/uploads/${req.file.filename}`;
                if (currentImage && fs.existsSync(`.${currentImage}`)) {
                    fs.unlinkSync(`.${currentImage}`);
                }
            }
            await Product.findByIdAndUpdate(productId, {
                nameProduct,
                categories: categoriesProduct,
                brandName: brandProduct,
                priceProduct,
                quantityProduct,
                colorProduct: color.split(','),
                sizeProduct: size.split(','),
                descriptionProduct: detailProduct,
                imageProduct,
            });

            res.json({ success: true, message: 'Cập nhật sản phẩm thành công.' });
        } catch (error) {
            console.error('Lỗi khi cập nhật sản phẩm:', error);
            res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi cập nhật sản phẩm.' });
        }
    }

    renderOrders(req, res, next) {
        const classOrders = 'hovered'
        Order.find({}).populate('userId', 'nameUser')
            .then(orders => {
                orders = orders.map(order => order.toObject());
                res.render('Admin/adminOrders', { orders, classOrders, title: 'Admin', layout: 'admin' })
            })
    }
    async renderOrderDetail(req, res, next) {
        const id = req.params.id; // Lấy ID đơn hàng từ URL
        console.log(id)
        try {
            const order = await Order.findById(id).lean();
            const orderDetails = await orderDetail.find({ orderId: id })
                .populate('productId')
                .lean();

            if (!order) {
                return res.status(404).send('Đơn hàng không tồn tại.');
            }


            res.render('Admin/adminOrdersDetail', {
                order,
                orderDetails,
                layout: 'auth',
                title: `Chi tiết đơn hàng - ${id}`
            });


        } catch (error) {
            console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
            res.status(500).send('Có lỗi xảy ra khi lấy chi tiết đơn hàng.');
        }
    }
    async updateOrderStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const updateFields = { status };
            if (status === "Thành công") {
                updateFields.deleteAt = new Date();
            }
            const updatedOrder = await Order.findByIdAndUpdate(
                id,
                updateFields,
                { new: true }
            );

            if (!updatedOrder) {
                return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
            }

            res.status(200).json({ message: 'Cập nhật thành công', updatedOrder });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    }
    renderVouchers(req, res, next) {
        const classVouchers = 'hovered';
        Voucher.find({})
            .then(voucher => {
                voucher = voucher.map(vouchers => vouchers.toObject());
                res.render('Admin/adminVouchers', { voucher, classVouchers, title: 'Admin', layout: 'admin' })
            })
            .catch(next)
    }
}

module.exports = new AdminController();