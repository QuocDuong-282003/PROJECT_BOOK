var express = require('express');

var { register, login, logout, getMyAccount, updateAccount } = require('../../controller/auth.controller');

var router = express.Router();

// Middleware kiểm tra đăng nhập
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    req.session.message = 'Vui lòng đăng nhập để truy cập!';
    res.redirect('/auth/login');
};

// Các route hiện có
router.get('/login', function(req, res, next) {
    const message = req.session.message;
    req.session.message = null;
    res.render('client/login', { title: 'Login', message });
});

router.get('/register', function(req, res, next) {
    const message = req.session.message;
    req.session.message = null;
    res.render('client/register', { title: 'Register', message });
});

router.get('/logout', logout);
router.post('/checkregister', register);
router.post('/checklogin', login);

// Route cho My Account
router.get('/myaccount', isAuthenticated, getMyAccount);
router.post('/update-account', isAuthenticated, updateAccount);

module.exports = router;