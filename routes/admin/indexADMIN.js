const express = require('express');
const router = express.Router();
const { checkAdmin } = require('../../controller/admin/auth.controller');

router.use(checkAdmin); // ✅ Chặn truy cập admin nếu chưa đăng nhập

router.get('/', (req, res) => {
    res.render('admin/indexADMIN', { 
        title: "", 
        user: req.user, 
        path: "admin"
    });
});
router.get('/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/admin/auth/login');
});


module.exports = router;
