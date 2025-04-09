var createError = require('http-errors');
var path = require('path');

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// const User = require('./models/User');


const session = require('express-session'); //thông báo đăng ký tài khoản thành công

const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const { scheduleDeleteExpiredDiscounts } = require('./controller/admin/discountController');


//
var indexRouter = require('./routes/client/index');
var indexADMIN = require('./routes/admin/indexADMIN');
var authRouter = require('./routes/client/auth');
const Cart = require('./models/Cart');
const app = express();
//
app.use(methodOverride('_method'));
app.use(cors());
// view engine setup
app.use(express.static('public'));
app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'views/client'), path.join(__dirname, 'views/admin')]);
app.set('view engine', 'ejs');

//config port
const PORT = process.env.PORT || 3000;
// Kết nối MongoDB
connectDB();
// Middleware xử lý JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //

// Middleware xử lý session
app.use(session({
    secret: process.env.JWT_SECRET, // Thay bằng một chuỗi bí mật
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Đặt true nếu dùng HTTPS
}));

app.use(async (req, res, next) => {
    res.locals.user = req.session.user || null; // Nếu chưa đăng nhập, user sẽ là null
    res.locals.cart = { items: [] }; // Giỏ hàng mặc định là rỗng
    res.locals.count = 0; // Số lượng mặc định là 0
    if (req.session.user) {
        try {
            const cart = await Cart.findOne({ userId: req.session.user.id }).populate("items.bookId");
            res.locals.cart = cart || { items: [] };  // Nếu không có giỏ hàng, gán mảng rỗng
            res.locals.count = res.locals.cart.items.length;
        } catch (error) {
            console.error("Lỗi khi lấy giỏ hàng:", error);
            res.locals.cart = { items: [] };
            res.locals.count = 0;
        }
    } else {
        res.locals.cart = { items: [] }; // Nếu chưa đăng nhập, gán giỏ hàng rỗng
    }

    next();
});



//
scheduleDeleteExpiredDiscounts();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//

//

app.use('/', indexRouter);
// ✅ Tạo tài khoản admin mặc định
const User = require('./models/User');
const bcrypt = require('bcrypt');

// Middleware để xử lý JSON và dữ liệu từ form
app.use(express.static('public'));
app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'views/client'), path.join(__dirname, 'views/admin')]);
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Client routes
var usersRouter = require('./routes/client/users');
var productsRouter = require('./routes/client/products');
var productdetail = require('./routes/client/productdetail');
var cartRouter = require('./routes/client/cart');
var vnpayRouter = require('./routes/client/checkout');
var cmtRouter = require('./routes/client/comment');
var orderListRouter = require('./routes/client/order-list');

// Admin routes
var authsRouter = require('./routes/admin/auth');
var userRouter = require('./routes/admin/users');
var categoryRouter = require('./routes/admin/category');
var bookRouter = require('./routes/admin/book');
var publisherRoutes = require("./routes/admin/publisher");
var commentRouter = require('./routes/admin/comment');
var indexADMIN = require('./routes/admin/indexADMIN');
var discountRouter = require('./routes/admin/discount');

// Client routes
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/products', productdetail)
app.use('/cart', cartRouter);
app.use('/comment', cmtRouter);
app.use('/admin', indexADMIN);
app.use('/auth', authRouter);
app.use('/checkout', vnpayRouter);
app.use('/orderlist', orderListRouter);



const { checkAdmin } = require('./controller/admin/auth.controller');


app.use('/admin/auth', authsRouter);
app.use('/admin', checkAdmin, indexADMIN);
app.use('/admin/users', checkAdmin, userRouter);
app.use('/admin/category', checkAdmin, categoryRouter);
app.use('/admin/comment', checkAdmin, commentRouter);
app.use('/admin/books', checkAdmin, bookRouter);
app.use('/admin/discount', checkAdmin, discountRouter);
app.use('/admin/publishers', checkAdmin, publisherRoutes);



app.listen(PORT, () => console.log(`🚀 Server running on port http://localhost:${PORT}`));
module.exports = app;

