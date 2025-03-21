const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Thêm dòng này


// Tạo token JWT
const generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

//Đăng ký 
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
            password, // Truyền password gốc, model sẽ xử lý hash
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


//Đăng nhập
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
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

        res.redirect('/'); // Chuyển hướng về trang index
    } catch (error) {
        console.error("❌ Lỗi Server:", error);
        res.status(500).json({ message: 'Lỗi Server', error });
    }
};


// Đăng xuất
exports.logout = (req, res) => {
    req.session.destroy((err) => { // Xóa session
        if (err) {
            console.error("Lỗi khi đăng xuất:", err);
            return res.status(500).json({ message: 'Lỗi Server' });
        }
        
        res.clearCookie('jwt'); // Xóa cookie
        res.redirect('/'); // Chuyển hướng về trang chủ
    });
};
