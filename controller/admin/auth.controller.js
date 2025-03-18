const User = require('../../models/User');
const jwt = require('jsonwebtoken');

// Render trang đăng nhập
exports.renderLogin = (req, res) => {
    res.render('admin/auth/login', {
        path: 'auth/login',
        title: 'Login Page',
        error: null
    });
};

// Xử lý đăng nhập
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Email:', email);
        console.log('Password từ request:', password);
       
        // Kiểm tra đuôi email
        if (!email.endsWith('.admin')) {
            return res.render('admin/auth/login', { error: 'Chỉ email có đuôi ".admin" mới được truy cập!' });
        }

        // Kiểm tra có admin chưa
        const existingAdmin = await User.findOne({ role: 'admin' });
        console.log('Existing admin:', existingAdmin);

        if (!existingAdmin) {
            // Nếu chưa có admin, tạo admin mới
            const newAdmin = await User.create({
                name: 'Admin',
                email,
                password, // Không cần mã hóa thủ công, hook sẽ xử lý
                role: 'admin',
                isAdmin: true
            });
            console.log('✅ Tài khoản admin đã được tạo:', newAdmin);
        }

        // Tìm user trong database
        const user = await User.findOne({ email });
        console.log('User từ database:', user);

        if (!user) {
            return res.render('admin/auth/login', { error: 'Tài khoản không tồn tại!' });
        }

        // Kiểm tra mật khẩu
        const isMatch = await user.matchPassword(password);
        console.log('Kết quả so sánh mật khẩu:', isMatch);
        if (!isMatch) {
            return res.render('admin/auth/login', { error: 'Mật khẩu không đúng!' });
        }

        const admin = await User.findOne({ role: 'admin' });
        console.log('Mật khẩu trong database:', admin.password);

        // Kiểm tra role
        if (user.role !== 'admin') {
            return res.render('admin/auth/login', { error: 'Bạn không có quyền truy cập!' });
        }

        // Tạo token JWT
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Lưu token vào cookie
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 3600000
        });

        // Chuyển hướng về trang admin
        return res.redirect('/admin');
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        res.status(500).send('Lỗi Server');
    }
};
// Xử lý đăng xuất
exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/admin/auth/login');
};

// Middleware kiểm tra quyền admin
exports.checkAdmin = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.redirect('/admin/auth/login');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || decoded.role !== 'admin') {
            res.clearCookie('token');
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