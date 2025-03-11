const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

exports.renderLogin = (req, res) => {
    res.render('admin/auth/login', {
        path: 'auth/login',
        title: 'Login Page',
        error: null
    });
};

// 🛑 Đăng nhập
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 📌 Kiểm tra có admin chưa
        const existingAdmin = await User.findOne({ role: 'admin' });

        if (!existingAdmin) {
            // Nếu chưa có admin, tài khoản này sẽ trở thành admin duy nhất
            const hashedPassword = await bcrypt.hash(password, 10);
            const newAdmin = await User.create({
                name: 'Admin',
                email,
                password: hashedPassword,
                role: 'admin',
                isAdmin: true
            });

            console.log('✅ Tài khoản admin đã được tạo:', newAdmin);
        }

        // 📌 Tìm user trong database
        const user = await User.findOne({ email });

        if (!user) {
            return res.render('admin/auth/login', { error: 'Tài khoản không tồn tại!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('admin/auth/login', { error: 'Mật khẩu không đúng!' });
        }

        if (user.role !== 'admin') {
            return res.render('admin/auth/login', { error: 'Bạn không có quyền truy cập!' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000
        });

        return res.redirect('/admin');
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        res.status(500).send('Lỗi Server');
    }
};
exports.logout = (req, res) => {
    res.clearCookie('token');  // Xóa cookie token
    res.redirect('/admin/auth/login');  // Điều hướng về trang đăng nhập
};

// 🛑 Chặn truy cập vào tất cả các trang admin nếu chưa đăng nhập

exports.checkAdmin = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.redirect('/admin/auth/login'); // Chuyển về trang login nếu chưa đăng nhập
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || decoded.role !== 'admin') {
            res.clearCookie('token'); // Xóa token nếu không hợp lệ
            return res.redirect('/admin/auth/login');
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Lỗi xác thực admin:', error);
        res.clearCookie('token');
        return res.redirect('/admin/auth/login');
    }
};


// // 🛑 Quên mật khẩu
// exports.forgotPassword = async (req, res) => {
//     try {
//         const { email } = req.body;
//         const admin = await User.findOne({ email, role: "admin" });

//         if (!admin) {
//             return res.status(400).json({ message: "Không tìm thấy tài khoản Admin!" });
//         }

//         // 📌 Tạo token reset
//         const resetToken = crypto.randomBytes(32).toString("hex");
//         const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

//         admin.resetPasswordToken = hashedToken;
//         await admin.save();

//         const resetLink = `http://localhost:3000/admin/auth/reset-password/${resetToken}`;

//         const transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//                 user: process.env.EMAIL_SENDER,
//                 pass: process.env.EMAIL_PASSWORD,
//             },
//         });

//         const mailOptions = {
//             from: process.env.EMAIL_SENDER,
//             to: admin.email,
//             subject: "Khôi phục mật khẩu Admin",
//             text: `Bấm vào đây để đặt lại mật khẩu: ${resetLink}`,
//         };

//         await transporter.sendMail(mailOptions);

//         res.json({ message: "Email khôi phục đã được gửi!" });
//     } catch (error) {
//         console.error("Lỗi gửi email:", error);
//         res.status(500).json({ message: "Lỗi Server" });
//     }
// };


// exports.renderResetPassword = async (req, res) => {
//     const { token } = req.params;

//     // Mã hóa token để so sánh với database
//     const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

//     // Tìm admin với token hợp lệ
//     const admin = await User.findOne({ resetPasswordToken: hashedToken });

//     if (!admin) {
//         return res.render('admin/auth/login', { error: 'Token không hợp lệ!' });
//     }

//     res.render('admin/auth/reset-password', { token });
// };
// exports.resetPassword = async (req, res) => {
//     try {
//         const { token } = req.params;
//         const { password } = req.body;

//         // Mã hóa token để so sánh với database
//         const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

//         const admin = await User.findOne({ resetPasswordToken: hashedToken });

//         if (!admin) {
//             return res.render('admin/auth/login', { error: 'Token không hợp lệ!' });
//         }

//         // ✅ Cập nhật mật khẩu mới
//         admin.password = await bcrypt.hash(password, 10);
//         admin.resetPasswordToken = undefined; // Xóa token để không thể dùng lại
//         await admin.save();

//         res.render('admin/auth/login', { error: 'Đặt lại mật khẩu thành công! Hãy đăng nhập.' });
//     } catch (error) {
//         console.error("Lỗi đặt lại mật khẩu:", error);
//         res.render('admin/auth/login', { error: 'Lỗi khi đặt lại mật khẩu!' });
//     }
// };
