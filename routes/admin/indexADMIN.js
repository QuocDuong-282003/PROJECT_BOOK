
var express = require('express');
var router = express.Router();
const Discount = require('../../models/Discount');
const Order = require('../../models/Order');
const Publisher = require('../../models/Publisher');
const discountController = require('../../controller/admin/discountController');
const orderController = require('../../controller/admin/orderController');
const publisherController = require('../../controller/admin/publisherController');

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
router.post('/discount/update/:id', discountController.updateDiscount);
router.delete('/discount/delete/:id', discountController.deleteDiscount);

// discount seach
router.get("/discounts", discountController.getDiscounts);


// const { checkAdmin } = require('../../controller/admin/auth.controller');

// router.use(checkAdmin); // ✅ Chặn truy cập admin nếu chưa đăng nhập

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

//order
router.get('/order', orderController.getAllOrders);
//publisher
router.get('/publisher', publisherController.getPublishers);
router.post('/publisher/create/add', publisherController.createPublisher);
router.delete('/publisher/delete/:id', publisherController.deletePublisher);
router.post('/publisher/update/:id', publisherController.updatePublisher);
module.exports = router;
