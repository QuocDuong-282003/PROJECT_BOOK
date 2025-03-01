const User = require('../../models/User');

// 📌 Lấy danh sách tất cả người dùng
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Ẩn mật khẩu
        res.status(200).json({ success: true, data: users });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách người dùng.', error: err.message });
    }
};

// 📌 Lấy thông tin người dùng theo ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy thông tin người dùng.', error: err.message });
    }
};

// 📌 Cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
    try {
        const { username, email, role } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { username, email, role }, { new: true });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
        }

        res.status(200).json({ success: true, message: 'Cập nhật thông tin người dùng thành công.', data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật thông tin người dùng.', error: err.message });
    }
};

// 📌 Khóa/Mở khóa tài khoản khách hàng
exports.toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
        }

        user.isActive = !user.isActive; // Đảo trạng thái tài khoản
        await user.save();

        res.status(200).json({ success: true, message: `Tài khoản ${user.isActive ? 'đã được mở khóa' : 'đã bị khóa'}.`, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật trạng thái tài khoản.', error: err.message });
    }
};

// 📌 Thống kê hoạt động người dùng
exports.getUserStatistics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ isActive: true });
        const totalProductViews = await User.aggregate([{ $group: { _id: null, total: { $sum: "$productViews" } } }]);
        const totalCartItems = await User.aggregate([{ $group: { _id: null, total: { $sum: "$cartItemsAdded" } } }]);

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                activeUsers,
                totalProductViews: totalProductViews[0]?.total || 0,
                totalCartItems: totalCartItems[0]?.total || 0
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy thống kê người dùng.', error: err.message });
    }
};
