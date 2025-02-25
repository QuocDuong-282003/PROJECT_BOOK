const User = require("../../models/User");

// 🔹 1. Lấy danh sách người dùng (lọc theo vai trò)
exports.getUsers = async (req, res) => {
    try {
        const { role } = req.query; // Lọc theo vai trò nếu có
        const filter = role ? { role } : {};
        const users = await User.find(filter);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi lấy danh sách người dùng." });
    }
};

// 🔹 2. Cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng." });
        res.status(200).json({ message: "Cập nhật thành công!", user });
    } catch (error) {
        res.status(400).json({ message: "Lỗi khi cập nhật thông tin." });
    }
};

// 🔹 3. Khóa/Mở khóa tài khoản
exports.toggleUserBlock = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng." });

        user.isBlocked = !user.isBlocked;
        await user.save();

        res.status(200).json({ message: `Tài khoản đã ${user.isBlocked ? "bị khóa" : "được mở khóa"}` });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi thay đổi trạng thái tài khoản." });
    }
};

// 🔹 4. Thống kê hoạt động người dùng
exports.getUserStatistics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalAdmins = await User.countDocuments({ role: "admin" });
        const totalCustomers = await User.countDocuments({ role: "user" });

        // 🚀 Thống kê này cần thêm dữ liệu từ bảng đơn hàng và lượt xem sản phẩm
        res.status(200).json({
            totalUsers,
            totalAdmins,
            totalCustomers
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi lấy thống kê người dùng." });
    }
};
