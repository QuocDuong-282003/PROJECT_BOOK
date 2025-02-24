var createError = require('http-errors');
var express = require('express');
var path = require('path');

const port = 3000;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var indexADMIN = require('./routes/admin/indexADMIN');
var productdetail = require('./routes/productdetail');
var cartRouter = require('./routes/cart');
var app = express();
// view engine setup
app.use(express.static('public'));
app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'views/client'),path.join(__dirname, 'views/admin')]);
app.set('view engine', 'ejs');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/products', productdetail);
app.use('/cart', cartRouter);
app.use('/admin', indexADMIN);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
module.exports = app;
