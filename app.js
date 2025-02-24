var createError = require('http-errors');
var express = require('express');
var path = require('path');

const port = 3000;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
// Cấu hình thư mục 'public' làm thư mục tĩnh
app.use(express.static(path.join(__dirname, 'public')));
// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');


app.use('/', indexRouter);
app.use('/users', usersRouter);



app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}`);
  next();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;
