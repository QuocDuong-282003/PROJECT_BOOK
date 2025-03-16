// controllers/admin/users.controller.js
const User = require('../../models/User');
const bcrypt = require('bcryptjs');

// Thêm người dùng
exports.addUser = async (req, res) => {
    try {
        const { name, email, phone, address, role, password } = req.body;

        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Email đã tồn tại.');
        }

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo người dùng mới
        const newUser = new User({
            name,
            email,
            phone,
            address,
            role,
            password: hashedPassword,
            isActive: true
        });

        await newUser.save();
        res.redirect('/admin/users'); // Chuyển hướng về trang quản lý người dùng
    } catch (err) {
        res.status(500).send('Lỗi server khi thêm người dùng.');
    }
};

// Cập nhật người dùng
exports.updateUser = async (req, res) => {
    try {
        const { name, email, phone, address, role, isActive } = req.body;

        // Tìm và cập nhật người dùng
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, phone, address, role, isActive },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).send('Không tìm thấy người dùng.');
        }

        res.redirect('/admin/users'); // Chuyển hướng về trang quản lý người dùng
    } catch (err) {
        res.status(500).send('Lỗi server khi cập nhật người dùng.');
    }
};

// Xóa người dùng
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('Không tìm thấy người dùng.');
        }

        if (user.role === 'admin') {
            return res.status(403).send('Không được phép xóa tài khoản admin.');
        }

        await User.findByIdAndDelete(userId);
        res.redirect('/admin/users'); // Chuyển hướng về trang quản lý người dùng
    } catch (err) {
        res.status(500).send('Lỗi server khi xóa người dùng.');
    }
};

// Reset mật khẩu
exports.resetPassword = async (req, res) => {
    try {
        const userId = req.params.id;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt); // Reset về mật khẩu mặc định

        const user = await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
        if (!user) {
            return res.status(404).send('Không tìm thấy người dùng.');
        }

        res.redirect('/admin/users'); // Chuyển hướng về trang quản lý người dùng
    } catch (err) {
        res.status(500).send('Lỗi server khi đặt lại mật khẩu.');
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10; // Số lượng user mỗi trang
        const skip = (page - 1) * limit;

        const users = await User.find().skip(skip).limit(limit);
        const totalUsers = await User.countDocuments(); // Đếm tổng số user
        const totalPages = Math.ceil(totalUsers / limit);

        res.render('admin/user/user', {
            title: 'Quản lý Người dùng',
            users, // Truyền danh sách người dùng
            totalUsers,
            totalPages,
            currentPage: page
        });
    } catch (error) {
        res.status(500).send('Lỗi server khi lấy danh sách người dùng.');
    }
};
//Tìm kiếm người dùng (tiếp tục)
exports.searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        let filter = {};

        if (query) {
            filter.$or = [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { phone: { $regex: query, $options: 'i' } }
            ];
        }

        const users = await User.find(filter).select('-password');
        res.render('admin/user/usersAdmin', { users });
    } catch (err) {
        res.status(500).send('Lỗi server khi tìm kiếm người dùng.');
    }
};

// Lấy thông tin chi tiết người dùng
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).send('Không tìm thấy người dùng.');
        }
        res.render('admin/user/userDetail', { user });
    } catch (err) {
        res.status(500).send('Lỗi server khi lấy thông tin người dùng.');
    }
};

// Lấy đơn hàng của người dùng
exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).populate('orders');
        if (!user) {
            return res.status(404).send('Không tìm thấy người dùng.');
        }
        res.render('admin/user/userOrders', { orders: user.orders });
    } catch (err) {
        res.status(500).send('Lỗi server khi lấy đơn hàng của người dùng.');
    }
};