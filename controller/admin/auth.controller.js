const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const crypto = require('crypto');

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

        // 📌 Kiểm tra đuôi email có phải ".admin" không
        if (!email.endsWith('.admin')) {
            return res.render('admin/auth/login', { error: 'Chỉ email có đuôi ".admin" mới được truy cập!' });
        }

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

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET1, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
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

        const decoded = jwt.verify(token, process.env.JWT_SECRET1);

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