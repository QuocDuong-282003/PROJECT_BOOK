
var express = require('express');
var router = express.Router();
const Discount = require('../../models/Discount');
const discountController = require('../../controller/admin/discountController');
const orderController = require('../../controller/admin/orderController');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('indexADMIN', { title: 'Home', path: "" });
});
router.get('/products', function (req, res, next) {
  res.render('productsADMIN', { title: 'Products', path: req.path });
});
// discount

router.get('/discount', discountController.renderDiscountPage);
router.post('/admin/discount/create/add', discountController.createDiscount);
router.put('/admin/discount/update/:id', discountController.updateDiscount);
router.delete('/discount/delete/:id', discountController.deleteDiscount);


//order
router.get('/order', orderController.getAllOrders);

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
