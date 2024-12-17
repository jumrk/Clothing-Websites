const User = require('../models/User');
const nodemailer = require('nodemailer');
const resetCodeMap = new Map(); // Bộ nhớ tạm lưu mã xác nhận

class ForgotPasswordController {

    renderForgotPassword(req, res) {
        res.render('page/forgotPassword', { layout: "auth", title: "Quên mật khẩu" })
    }

    async sendResetCode(req, res) {
        const { email } = req.body;

        try {
            const user = await User.findOne({ emailUser: email });
            if (!user) {
                return res.status(404).json({ success: false, message: "Email không tồn tại" });
            }

            const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = Date.now() + 15 * 60 * 1000; // Hết hạn sau 15 phút

            // Lưu mã và thời gian hết hạn vào Map
            resetCodeMap.set(email, { resetCode, expiresAt });

            // Gửi email
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'jumrk03@gmail.com',
                    pass: 'ohis ntfc wxem ufdz',
                },
            });

            await transporter.sendMail({
                from: 'jumrk03@gmail.com',
                to: email,
                subject: 'Mã xác nhận quên mật khẩu',
                text: `Mã xác nhận của bạn là: ${resetCode}`,
            });

            res.json({ success: true, message: "Mã xác nhận đã được gửi về email." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Lỗi server." });
        }
    }

    async verifyResetCode(req, res) {
        const { email, code } = req.body;

        try {
            const data = resetCodeMap.get(email);

            if (!data || data.resetCode !== code) {
                return res.status(400).json({ success: false, message: "Mã xác nhận không hợp lệ." });
            }

            if (data.expiresAt < Date.now()) {
                resetCodeMap.delete(email); // Xóa mã sau khi hết hạn
                return res.status(400).json({ success: false, message: "Mã xác nhận đã hết hạn." });
            }

            res.json({ success: true, message: "Mã xác nhận đúng." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Lỗi server." });
        }
    }

    async resetPassword(req, res) {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ emailUser: email });
            if (!user) {
                return res.status(404).json({ success: false, message: "Email không tồn tại." });
            }

            resetCodeMap.delete(email);

            user.passwordUser = password;
            await user.save();

            res.json({ success: true, message: "Đặt lại mật khẩu thành công." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Lỗi server." });
        }
    }

}

module.exports = new ForgotPasswordController();
