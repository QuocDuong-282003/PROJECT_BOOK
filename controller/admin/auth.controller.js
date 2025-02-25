const User = require('../../models/User');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

exports.renderLogin = (req, res) => {
    res.render('admin/auth/login', { error: null });
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.render('admin/auth/login', { error: 'Email không tồn tại!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('admin/auth/login', { error: 'Mật khẩu không đúng!' });
        }

        if (user.role !== 'admin') {
            return res.render('admin/auth/login', { error: 'Bạn không có quyền truy cập!' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true, secure: false });
        return res.redirect('/admin/dashboard'); // Chuyển hướng sau khi đăng nhập thành công
    } catch (error) {
        return res.render('admin/auth/login', { error: 'Lỗi server!' });
    }
};

// 🟢 Đăng xuất
exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/admin/login'); // Chuyển hướng về trang đăng nhập
};

// 🟢 Kiểm tra Admin
exports.checkAdmin = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.redirect('/admin/login');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập!' });
        }

        next();
    } catch (error) {
        return res.redirect('/admin/login');
    }
};
