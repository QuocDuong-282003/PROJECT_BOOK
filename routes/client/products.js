var express = require('express');
var router = express.Router();
const {getAllBooks, getProductByCategory, findProductByName, sortByPrice, sortBySelling}= require('../../controller/Client/product.controller');
const {getAllCategories} = require('../../controller/Client/category.controller');

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
router.get('/search', async function(req, res){
  const name = req.query.name;
  console.log(name);
  const AllCategories = await getAllCategories();
  const Products = await findProductByName(name);
  res.render('client/products', { title: 'Products' ,Products, AllCategories});
});
router.get('/sort', async function(req, res){
  const sortType = req.query.value;
  console.log(sortType);
  const AllCategories = await getAllCategories();
  if(sortType == 2){
    const Products = await sortByPrice(-1);
    res.json({title: 'Products' ,Products, AllCategories});
  }else if(sortType == 3){
    const Products = await sortByPrice(1);
    res.json({title: 'Products' ,Products, AllCategories});
  }else if(sortType == 4){
    const Products = await sortBySelling(-1);
    res.json({title: 'Products' ,Products, AllCategories});
  }
  // res.render('client/products', { title: 'Products' ,Products, AllCategories});
});
module.exports = router;
