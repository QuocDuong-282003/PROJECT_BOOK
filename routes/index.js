var express = require('express');
var router = express.Router();
const { getAllBooks } = require('../controller/Client/product.controller');
/* GET home page. */
router.get('/', async function (req, res, next) {
  const products = await getAllBooks();
  res.render("index", { title: 'HOME', products })
});

module.exports = router;
