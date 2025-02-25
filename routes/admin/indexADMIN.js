var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('indexADMIN', { title: 'Home' ,path:""});
});
router.get('/products', function(req, res, next) {
  res.render('productsADMIN', { title: 'Products' , path: req.path});
});
module.exports = router;
