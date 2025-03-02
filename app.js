var createError = require('http-errors');
var path = require('path');

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// Kết nối MongoDB
connectDB();

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
app.use(cors({
    origin: '*', // Hoặc bạn có thể chỉ định domain của client nếu không muốn mở rộng quá nhiều
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Config port
const PORT = process.env.PORT || 3000;

// Client routes
var indexRouter = require('./routes/client/index');
var usersRouter = require('./routes/client/users');
var productsRouter = require('./routes/client/products');
var productdetail = require('./routes/client/productdetail');
var cartRouter = require('./routes/client/cart');

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
app.use('/client/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/product-detail', productdetail);
app.use('/cart', cartRouter);

const { checkAdmin } = require('./controller/admin/auth.controller');

app.use('/admin/auth', authsRouter); // Login không cần checkAdmin
app.use('/admin', checkAdmin, indexADMIN);
app.use('/admin/users', checkAdmin, userRouter);
app.use('/admin/category', checkAdmin, categoryRouter);
app.use('/admin/comment', checkAdmin, commentRouter);
app.use('/admin/books', checkAdmin, bookRouter);
app.use('/admin/discount', checkAdmin, discountRouter);
app.use('/admin/publishers', checkAdmin, publisherRoutes);

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port http://localhost:${PORT}`));

module.exports = app;
