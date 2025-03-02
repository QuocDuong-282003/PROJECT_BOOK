var express = require('express');
var { register, login, logout } = require('../controller/auth.controller');
var router = express.Router();

router.get('/login', function(req, res, next) {
    const message = req.session.message; // Lấy thông báo từ session
    req.session.message = null; // Xóa sau khi hiển thị
    res.render('client/login', { title: 'Login', message });
});

router.get('/register', function(req, res, next) {
    const message = req.session.message; // Lấy thông báo từ session
    req.session.message = null; // Xóa sau khi hiển thị
    res.render('client/register', { title: 'Register', message });
});

router.get('/logout', logout);
router.post('/checkregister', register);
router.post('/checklogin', login);


module.exports = router;
