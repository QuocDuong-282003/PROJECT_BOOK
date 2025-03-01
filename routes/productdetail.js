var express = require('express');
var router = express.Router();
var {getProductById} = require('../controller/Client/product.controller');
router.get('/productdetail/:_id', async function(req, res, next) {
  const _idBook = req.params._id;
  const book = await getProductById(_idBook);
  res.render('client/productdetail', { title: 'Product Detail',book });
});

module.exports = router;
