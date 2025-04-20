var express = require('express');
var router = express.Router();
const { getAllBooks } = require('../../controller/Client/product.controller');
const { getCartByUserId } = require('../../controller/Client/cart.controller');
/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    const books = await getAllBooks();
    res.render("index", { title: 'HOME', books });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sách:", error);
    res.status(500).send("Lỗi server");
  }

});


module.exports = router;
