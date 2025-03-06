const User = require('../../models/User');
const Order = require('../../models/Order');
const bcrypt = require('bcrypt');

exports.addUser = async (req, res) => {
    try {
        const { name, email, phone, address, role, password } = req.body;

        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email đã tồn tại.' });
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
            isActive: true // Mặc định kích hoạt
        });

        await newUser.save();
        res.json({ success: true, message: 'Thêm người dùng thành công.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server khi thêm người dùng.', error: err.message });
    }
};
// 📌 Lấy danh sách tất cả người dùng
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
            path: 'users',   // Thêm biến path để tránh lỗi
            users,
            totalUsers,
            totalPages,
            currentPage: page
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
        res.status(500).send("Lỗi server");
    }
};

// 📌 Lấy thông tin chi tiết người dùng
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).render('admin/error', { message: 'Không tìm thấy người dùng.' });
        }
        res.render('admin/user/user', { user }); // ⚡ Render giao diện chi tiết
    } catch (err) {
        res.status(500).render('admin/error', { message: 'Lỗi server khi lấy thông tin người dùng.', error: err.message });
    }
};

// 📌 Toggle trạng thái hoạt động của người dùng
exports.toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).render('admin/error', { message: 'Không tìm thấy người dùng.' });
        }
        user.isActive = !user.isActive;
        await user.save();
        res.redirect('/admin/user/user'); // ⚡ Quay về danh sách người dùng
    } catch (err) {
        res.status(500).render('admin/error', { message: 'Lỗi server khi cập nhật trạng thái người dùng.', error: err.message });
    }
};

// 📌 Tìm kiếm & Lọc danh sách người dùng
// 📌 Tìm kiếm & Lọc danh sách người dùng
exports.searchUsers = async (req, res) => {
    try {
        const { query } = req.query; // Sửa từ `keyword` thành `query`
        let filter = {};

        if (query) {
            filter.$or = [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { phone: { $regex: query, $options: 'i' } }
            ];
        }

        const users = await User.find(filter).select('-password');
        res.json({ success: true, users }); // Trả về JSON
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server khi tìm kiếm người dùng.', error: err.message });
    }
};
// 📌 Xóa người dùng
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ success: false, message: 'Không được phép xóa tài khoản admin.' });
        }

        await User.findByIdAndDelete(userId);
        res.json({ success: true, message: 'Xóa người dùng thành công!' });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi xóa người dùng.',
            error: err.message
        });
    }
};
// 📌 Cập nhật thông tin người dùng
// 📌 Cập nhật thông tin người dùng
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
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
        }

        res.json({ success: true, message: 'Cập nhật người dùng thành công.', user });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật người dùng.', error: err.message });
    }
};
// 📌 Phân quyền người dùng (User, Admin)
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });

        if (!user) {
            return res.status(404).render('admin/error', { message: 'Không tìm thấy người dùng.' });
        }

        res.redirect('/admin/user/user'); // ⚡ Quay về danh sách người dùng
    } catch (err) {
        res.status(500).render('admin/error', { message: 'Lỗi server khi cập nhật quyền người dùng.', error: err.message });
    }
};

// 📌 Xem lịch sử mua hàng của khách hàng
exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.params.id;
        const orders = await Order.find({ userId }).populate('items.productId');

        if (!orders.length) {
            return res.status(404).json({ success: false, message: 'Người dùng chưa có đơn hàng nào.' });
        }

        res.json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy lịch sử mua hàng.', error: err.message });
    }
};
// 📌 Đặt lại mật khẩu người dùng
exports.resetPassword = async (req, res) => {
    try {
        const userId = req.params.id;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt); // Reset về mật khẩu mặc định

        const user = await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
        }

        res.json({ success: true, message: 'Đặt lại mật khẩu thành công!' });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi đặt lại mật khẩu.',
            error: err.message
        });
    }
};

// 📌 Lấy thống kê người dùng
exports.getUserStatistics = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        const orders = await Order.find({ userId });

        res.json({
            success: true,
            user,
            orders
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy thống kê.',
            error: err.message
        });
    }
};