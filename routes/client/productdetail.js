var express = require('express');
var router = express.Router();

var { getProductById } = require('../../controller/Client/product.controller');
var { getCMTByBookId } = require('../../controller/Client/comment.controller');
router.get('/productdetail/:_id', async function (req, res) {
  const idBook = req.params._id;
  const book = await getProductById(idBook);
  const cmtList = await getCMTByBookId(idBook);
  res.render('client/productdetail', { title: 'Product Detail', book, idBook, cmtList });
});

module.exports = router;
