const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.renderLogin = (req, res) => {
    res.render('admin/auth/login', {
        path: 'auth/login',
        title: 'Login Page',
        error: null
    });
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const adminEmail = "admin@iuh.com"; 

        if (email !== adminEmail) {
            return res.render('admin/auth/login', { error: 'Bạn không có quyền truy cập!' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.render('admin/auth/login', { error: 'Email không tồn tại!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('admin/auth/login', { error: 'Mật khẩu không đúng!' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000,
        });

        return res.redirect('/admin'); 
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        return next(error);
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



