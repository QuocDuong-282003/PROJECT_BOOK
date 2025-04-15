var express = require('express');
var router = express.Router();
const { getAllBooks, getProductByCategory } = require('../../controller/Client/product.controller');
const { getAllCategories } = require('../../controller/Client/category.controller');

router.get('/', async function (req, res, next) {
  const books = await getAllBooks();
  const AllCategories = await getAllCategories();
  res.render('client/index', { title: 'Products', books, AllCategories });
});
router.get('/category=:_idCategory', async function (req, res, next) {
  const _idCategory = req.params._idCategory;
  const AllCategories = await getAllCategories();
  const books = await getProductByCategory(_idCategory);
  res.render('client/products', { title: 'Products', books, AllCategories });
});
module.exports = router;
