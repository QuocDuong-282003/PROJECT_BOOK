var express = require('express');
var router = express.Router();

router.get('/productdetail', function(req, res, next) {
  res.render('client/productdetail', { title: 'Product Detail' });
});

module.exports = router;
