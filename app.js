var createError = require('http-errors');
var path = require('path');

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const cors = require('cors');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const { scheduleDeleteExpiredDiscounts } = require('./controller/admin/discountController');


//
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var indexADMIN = require('./routes/admin/indexADMIN');
var productdetail = require('./routes/productdetail');
var cartRouter = require('./routes/cart');

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
//
scheduleDeleteExpiredDiscounts();
// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/products', productdetail);
app.use('/cart', cartRouter);
app.use('/admin', indexADMIN);

app.listen(PORT, () => console.log(`🚀 Server running on port http://localhost:${PORT}`));
module.exports = app;
