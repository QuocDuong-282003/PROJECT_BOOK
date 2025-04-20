const express = require('express');
const router = express.Router();
const bookController = require('../../controller/admin/book.controller');
const multer = require('multer');
const Middleware = require('../../config/Middleware');
const uploadImages = require('../../config/uploadImages');

const handleMulter = async (req, res, next) => {
    uploadImages(req, res, async function (err) {
        if (err) {
            return res.status(400).send('Lỗi upload ảnh: ' + err.message);
        }
        next();  // Tiếp tục tới controller
    });
};
// Route hiển thị danh sách sách
router.get('/', bookController.getBooks);

// Route thêm sách
router.post('/', handleMulter, bookController.createBook);

// Route cập nhật sách
router.post('/update/:id', handleMulter, bookController.updateBook);

// Route xóa sách
router.post('/delete/:id', bookController.deleteBook);

// Route tìm kiếm sách
router.get('/search', bookController.searchBooks);

// add discount for product
router.post('/assign/addProduct', bookController.assignDiscountToBook);
// cancel discount for product
//router.post('/assign/cancelDiscount', bookController.cancelDiscountForBook);
module.exports = router;