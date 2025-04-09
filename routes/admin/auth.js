const express = require('express');
const router = express.Router();
const adminAuthController = require('../../controller/admin/auth.controller');

router.get('/login', adminAuthController.renderLogin);

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });
router.post('/checklogin', adminAuthController.login);
router.get('/logout', adminAuthController.logout);
// router.post('/forgot-password', adminAuthController.forgotPassword);
// router.get('/reset-password/:token', adminAuthController.renderResetPassword);
// router.post('/reset-password/:token', adminAuthController.resetPassword);
// router.get('/reset-password/:token', (req, res) => {
//     const { token } = req.params;
//     res.render('admin/auth/reset-password', { token });
// });


module.exports = router;
