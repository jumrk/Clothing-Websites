const User = require('../models/User');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'thuan123';
class LoginController {
    login(req, res) {
        res.render('page/login', { title: 'Đăng nhập', layout: 'auth', cssFile: 'auth.css' });
    }
    register(req, res) {
        res.render('page/register', { title: 'đăng ký', layout: 'auth', cssFile: 'auth.css' })
    }
    forgotPassword(req, res) {
        res.render()
    }
    async store(req, res, next) {
        try {
            const { nameUser, emailUser, passwordUser, phoneUser } = req.body;

            // Kiểm tra email đã tồn tại
            const existingUser = await User.findOne({ emailUser });
            if (existingUser) {
                return res.render('page/register', { error: "Email đã tồn tại!", title: 'đăng ký', layout: 'auth', cssFile: 'auth.css' })
            }

            // Lưu người dùng mới
            const user = new User(req.body);
            await user.save();
            res.render('page/login', { success: "Đăng ký tài khoảng thành công", title: 'Đăng nhập', layout: 'auth', cssFile: 'auth.css' });
        } catch (err) {
            res.render('page/register', { error: "Đã xảy ra lỗi. Vui lòng thử lại sau!", title: 'đăng ký', layout: 'auth', cssFile: 'auth.css' })
        }
    };
    async getStore(req, res) {
        const { emailUser, passwordUser } = req.body;
        try {
            const user = await User.findOne({ emailUser });
            if (!user) {
                res.render('page/login', { error: "Email không tồn tại!", title: 'Đăng nhập', layout: 'auth', cssFile: 'auth.css' });
            }
            const isPasswordValid = passwordUser == user.passwordUser;

            if (!isPasswordValid) {
                return res.render('page/login', { error: "Mật khẩu không chính xác!", title: 'Đăng nhập', layout: 'auth', cssFile: 'auth.css' });
            }
            const token = jwt.sign(
                {
                    id: user._id,
                    name: user.nameUser,
                    email: user.emailUser,
                    role: user.role,
                }, JWT_SECRET,
                { expiresIn: '1d' }
            )
            res.cookie('authToken', token, { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 });
            if (user.role === 'admin') {
                res.redirect('/admin/Dash-board');
            } else {
                res.redirect('/');
            }

        } catch (err) {
            res.render('page/login', { error: "Đã xảy ra lỗi.Vui lòng thử lại!", title: 'Đăng nhập', layout: 'auth', cssFile: 'auth.css' });
        }
    }
    logout(req, res, next) {
        res.clearCookie('authToken');
        res.redirect('/login');
    }

}

module.exports = new LoginController();