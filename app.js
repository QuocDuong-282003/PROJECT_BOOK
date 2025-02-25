var createError = require('http-errors');
var path = require('path');

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

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
var commentRouter = require('./routes/admin/comment');
var indexADMIN = require('./routes/admin/indexADMIN'); 




// View engine setup
app.use(express.static('public'));
app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'views/client'), path.join(__dirname, 'views/admin')]);
app.set('view engine', 'ejs');

app.set('views', [
    path.join(__dirname, 'views'),
    path.join(__dirname, 'views/admin'),
    path.join(__dirname, 'views/client')
]);

// Config port
const PORT = process.env.PORT || 3000;

// Kết nối MongoDB
connectDB();

// Client routes
app.use('/client/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/product-detail', productdetail);
app.use('/cart', cartRouter);

// Admin routes
app.use('/admin/auth', authsRouter);
app.use('/admin/users', userRouter);
app.use('/admin/category', categoryRouter);
app.use('/admin/comment', commentRouter);
app.use('/admin/books', bookRouter);
app.use('/admin', indexADMIN); 

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port http://localhost:${PORT}`));

module.exports = app;
