const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Tạo token JWT
const generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Đăng ký
exports.register = async (req, res) => {
    const { name, email, password, role, phone, address } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            req.session.message = 'Email đã tồn tại!';
            return res.redirect('/auth/login');
        }
        const user = await User.create({
            name,
            email,
            password,
            role,
            phone,
            address
        });
        req.session.message = 'Đăng ký thành công! Hãy đăng nhập.';
        res.redirect('/auth/login');
    } catch (error) {
        console.error(error);
        req.session.message = 'Lỗi server. Vui lòng thử lại!';
        res.redirect('/auth/login');
    }
};

// Đăng nhập
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            req.session.message = 'Sai tài khoản hoặc mật khẩu!';
            return res.redirect('/auth/login');
        }
        if (user.role !== 0 || user.isActive === false) {
            req.session.message = 'Bạn không có quyền truy cập!';
            return res.redirect('/auth/login');
        }
        req.session.user = {
            id: user._id,
            email: user.email,
            name: user.name
        };
        // Cập nhật lịch sử đăng nhập
        user.loginHistory.push({ loginAt: new Date() }); // Thêm thời gian đăng nhập hiện tại
        user.loginCount += 1; // Tăng số lần đăng nhập
        await user.save();

        res.redirect('/');
    } catch (error) {
        console.error("❌ Lỗi Server:", error);
        req.session.message = 'Lỗi server. Vui lòng thử lại!';
        res.redirect('/auth/login');
    }
};

// Đăng xuất
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Lỗi khi đăng xuất:", err);
            return res.status(500).json({ message: 'Lỗi Server' });
        }
        
        res.clearCookie('jwt');
        res.redirect('/');
    });

};

// Lấy thông tin tài khoản
exports.getMyAccount = async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id).select('-password');
        if (!user) {
            req.session.message = 'Không tìm thấy người dùng!';
            return res.redirect('/auth/login');
        }
        res.render('client/myaccount', { title: 'My Account', user, message: req.session.message });
        req.session.message = null; // Đặt lại message sau khi render
    } catch (error) {
        console.error(error);
        req.session.message = 'Lỗi server. Vui lòng thử lại!';
        res.redirect('/auth/login');
    }
};

// Cập nhật thông tin tài khoản
exports.updateAccount = async (req, res) => {
    const { name, email, phone, address, password, oldPassword } = req.body;

    try {
        const user = await User.findById(req.session.user.id);
        if (!user) {
            req.session.message = 'Không tìm thấy người dùng!';
            return res.redirect('/auth/myaccount');
        }

        // Kiểm tra xem có thay đổi thông tin nào không
        const hasChanges = name !== user.name || email !== user.email || phone !== user.phone || address !== user.address || password;

        // Nếu có thay đổi và không nhập mật khẩu cũ, yêu cầu nhập mật khẩu cũ
        if (hasChanges && !oldPassword) {
            req.session.message = 'Vui lòng nhập mật khẩu cũ để thay đổi thông tin!';
            return res.redirect('/auth/myaccount');
        }

        // Nếu có nhập mật khẩu cũ, kiểm tra tính hợp lệ
        if (oldPassword) {
            const isMatch = await user.matchPassword(oldPassword);
            if (!isMatch) {
                req.session.message = 'Mật khẩu cũ không đúng!';
                return res.redirect('/auth/myaccount');
            }
        }

        // Cập nhật thông tin nếu mật khẩu cũ đúng hoặc không có thay đổi
        if (hasChanges) {
            user.name = name || user.name;
            user.email = email || user.email;
            user.phone = phone || user.phone;
            user.address = address || user.address;

            // Nếu có mật khẩu mới, cập nhật mật khẩu
            if (password) {
                user.password = password; // Model sẽ tự động hash
            }

            await user.save();

            // Cập nhật session
            req.session.user = {
                id: user._id,
                email: user.email,
                name: user.name
            };

            req.session.message = 'Cập nhật thông tin thành công!';
            res.redirect('/auth/myaccount');
        } else {
            req.session.message = 'Không có thay đổi nào được thực hiện!';
            res.redirect('/auth/myaccount');
        }
    } catch (error) {
        console.error(error);
        req.session.message = 'Lỗi server. Vui lòng thử lại!';
        res.redirect('/auth/myaccount');
    }

};