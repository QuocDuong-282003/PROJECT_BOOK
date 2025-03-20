var createError = require('http-errors');
var path = require('path');

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const cors = require('cors');
const session = require('express-session'); //thông báo đăng ký tài khoản thành công
const flash = require('connect-flash');

//
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var indexADMIN = require('./routes/admin/indexADMIN');
var productdetail = require('./routes/productdetail');
var cartRouter = require('./routes/cart');
var authRouter = require('./routes/auth');

const app = express();
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
    secret: 'your_secret_key', // Thay bằng một chuỗi bí mật
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Đặt true nếu dùng HTTPS
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user || null; // Nếu chưa đăng nhập, user sẽ là null
    next();
});
//
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/products', productdetail);
app.use('/cart', cartRouter);
app.use('/admin', indexADMIN);
app.use('/auth', authRouter);


app.listen(PORT, () => console.log(`🚀 Server running on port http://localhost:${PORT}`));
module.exports = app;
