
var express = require('express');
var router = express.Router();
const Discount = require('../../models/Discount');
const Order = require('../../models/Order');
const Publisher = require('../../models/Publisher');
const discountController = require('../../controller/admin/discountController');
const orderController = require('../../controller/admin/orderController');
const publisherController = require('../../controller/admin/publisherController');
const orderStatsController = require('../../controller/admin/orderStatsController');

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
//

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

// chart order
// Route hiển thị trang thống kê
router.get('/stats', orderStatsController.renderOrderStats);

// Route API lấy dữ liệu thống kê theo ngày
router.get('/order/stats/daily', orderStatsController.getDailyStats);

// Route API lấy dữ liệu thống kê theo tháng
router.get('/order/stats/monthly', orderStatsController.getMonthlyStats);

//publisher
router.get('/publisher', publisherController.getPublishers);
router.post('/admin/publisher/create/add', publisherController.createPublisher);
router.delete('/publisher/delete/:id', publisherController.deletePublisher);
router.post('/publisher/update/:id', publisherController.updatePublisher);
//search
router.get("/publishers", publisherController.getSearchPublishers);
router.get('/orders/search', orderController.searchOrders);

//

module.exports = router;
