var express = require('express');
var router = express.Router();
const {getAllBooks, getProductByCategory,getProductByPublisher, findProductByName, sortByPrice, sortBySelling, getProductByFilter}= require('../../controller/Client/product.controller');
const {getAllCategories} = require('../../controller/Client/category.controller');
const {getAllPublishers} = require('../../controller/Client/publisher.controller');
router.get('/', async function(req, res, next) {
  const Products = await getAllBooks();
  const AllCategories = await getAllCategories();
  const AllPublishers = await getAllPublishers();
  res.render('client/products', { title: 'Products' ,Products, AllCategories, AllPublishers});
});
router.get('/category=:_idCategory', async function(req, res, next){
  const _idCategory = req.params._idCategory;
  const AllCategories = await getAllCategories();
  const AllPublishers = await getAllPublishers();
  const Products = await getProductByCategory(_idCategory);
  res.render('client/products', { title: 'Products' ,Products, AllCategories, AllPublishers});
});
router.get('/publisher=:_idPublisher', async function(req, res, next){
  const _idPublisher = req.params._idPublisher;
  const AllCategories = await getAllCategories();
  const AllPublishers = await getAllPublishers();
  const Products = await getProductByPublisher(_idPublisher);
  res.render('client/products', { title: 'Products' ,Products, AllCategories, AllPublishers});
});
router.get('/search', async function(req, res){
  const name = req.query.name;
  const AllCategories = await getAllCategories();
  const AllPublishers = await getAllPublishers();
  const Products = await findProductByName(name);
  res.render('client/products', { title: 'Products' ,Products, AllCategories, AllPublishers});
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
router.get('/filter', async function(req, res){
  const filterFrom = req.query.priceMin;
  const filterTo = req.query.priceMax;
  const AllCategories = await getAllCategories();
  const AllPublishers = await getAllPublishers();
  const Products = await getProductByFilter(filterFrom,filterTo);
  res.render('client/products', { title: 'Products' ,Products, AllCategories, AllPublishers});
});
module.exports = router;
