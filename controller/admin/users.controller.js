// controllers/admin/users.controller.js
const User = require('../../models/User');
const Order = require('../../models/Order');
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
        const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là 1
        const limit = 10; // Số lượng user mỗi trang
        const skip = (page - 1) * limit;

        // Sắp xếp người dùng: admin hiển thị đầu tiên
        const users = await User.find()
            .sort({ role: +1 }) // Sắp xếp theo role: admin (+1) sẽ lên đầu
            .skip(skip)
            .limit(limit);

        const totalUsers = await User.countDocuments(); // Đếm tổng số user
        const totalPages = Math.ceil(totalUsers / limit);

        res.render('admin/user/user', {
            title: 'Quản lý Người dùng',
            users, // Truyền danh sách người dùng đã sắp xếp
            totalUsers,
            totalPages,
            currentPage: page,
            query: req.query.query || '', // Truyền từ khóa tìm kiếm (nếu có)
        });
    } catch (error) {
        res.status(500).send('Lỗi server khi lấy danh sách người dùng.');
    }
};
exports.searchUsers = async (req, res) => {
    try {
        const query = req.query.query || ''; // Lấy từ khóa tìm kiếm từ query string, mặc định là chuỗi rỗng
        const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là 1
        const limit = 10; // Số lượng người dùng hiển thị trên mỗi trang
        const skip = (page - 1) * limit; // Vị trí bắt đầu lấy dữ liệu

        // Tìm kiếm người dùng với từ khóa và phân trang
        const users = await User.find({ name: { $regex: query, $options: 'i' } })
            .skip(skip)
            .limit(limit);

        // Đếm tổng số người dùng phù hợp với từ khóa tìm kiếm
        const totalUsers = await User.countDocuments({ name: { $regex: query, $options: 'i' } });

        // Tính tổng số trang
        const totalPages = Math.ceil(totalUsers / limit);

        // Render template và truyền các biến cần thiết
        res.render('admin/user/user', {
            title: 'Quản lý Người dùng',
            users: users,
            totalUsers: totalUsers,
            totalPages: totalPages, // Truyền tổng số trang vào template
            currentPage: page, // Truyền trang hiện tại vào template
            query: query, // Truyền từ khóa tìm kiếm vào template
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi server');
    }
};



// // Lấy đơn hàng của người dùng
exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).populate('orders');
        if (!user) {
            return res.status(404).send('Không tìm thấy người dùng.');
        }
        res.render('admin/orderAdmin', { orders: user.orders });
    } catch (err) {
        res.status(500).send('Lỗi server khi lấy đơn hàng của người dùng.');
    }
};
// // Cập nhật thống kê đăng nhập
// exports.updateLoginStats = async (req, res) => {
//     try {
//         const userId = req.params.id;

//         // Tìm người dùng theo userId
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ error: 'Không tìm thấy người dùng.' });
//         }

//         // Cập nhật thống kê đăng nhập
//         user.loginCount += 1;
//         user.lastLoginAt = new Date();
//         user.loginHistory.push({ loginAt: new Date() });
//         await user.save();

//         res.status(200).json({ message: 'Cập nhật thống kê đăng nhập thành công.' });
//     } catch (err) {
//         res.status(500).json({ error: 'Lỗi server khi cập nhật thống kê đăng nhập.' });
//     }
// };
// // Lấy thống kê đăng nhập của người dùng
// exports.getUserLoginStats = async (req, res) => {
//     try {
//         const userId = req.params.id;

//         // Tìm người dùng theo userId
//         const user = await User.findById(userId).select('loginCount lastLoginAt loginHistory');
//         if (!user) {
//             return res.status(404).json({ error: 'Không tìm thấy người dùng.' });
//         }

//         res.status(200).json({
//             loginCount: user.loginCount,
//             lastLoginAt: user.lastLoginAt,
//             loginHistory: user.loginHistory,
//         });
//     } catch (err) {
//         res.status(500).json({ error: 'Lỗi server khi lấy thống kê đăng nhập.' });
//     }
// };