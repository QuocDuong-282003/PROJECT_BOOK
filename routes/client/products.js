var express = require('express');
var router = express.Router();
const {getAllBooks, getProductByCategory, findProductByName}= require('../../controller/Client/product.controller');
const {getAllCategories} = require('../../controller/Client/category.controller');

router.get('/', async function(req, res, next) {
  const Products = await getAllBooks();
  const AllCategories = await getAllCategories();
  res.render('client/products', { title: 'Products' ,Products, AllCategories});
});
router.get('/category=:_idCategory', async function(req, res, next){
  const _idCategory = req.params._idCategory;
  const AllCategories = await getAllCategories();
  const Products = await getProductByCategory(_idCategory);
  res.render('client/products', { title: 'Products' ,Products , AllCategories});
});
router.get('/search', async function(req, res, next){
  const name = req.query.name;
  console.log(name);
  const AllCategories = await getAllCategories();
  const Products = await findProductByName(name);
  console.log(Products);
  res.render('client/products', { title: 'Products' ,Products, AllCategories});
});
module.exports = router;
