var express = require('express');
var router = express.Router();

var { getProductById,getBookisDiscount } = require('../../controller/Client/product.controller');
var { getCMTByBookId } = require('../../controller/Client/comment.controller');
router.get('/productdetail/:_id', async function (req, res) {
  const idBook = req.params._id;
  const book = await getProductById(idBook);
  const booksDiscount = await getBookisDiscount(idBook);
  const cmtList = await getCMTByBookId(idBook);
  res.render('client/productdetail', { title: 'Product Detail', book,booksDiscount, idBook, cmtList });
});

module.exports = router;
