const express = require('express');
const router = express.Router();
const bookController = require('../../controller/admin/book.controller');
const multer = require('multer');

// Cấu hình Multer để lưu file ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

// Route hiển thị danh sách sách
router.get('/', bookController.getBooks);

// Route thêm sách
router.post('/', upload.single('coverImage'), bookController.createBook);

// Route cập nhật sách
router.post('/update/:id', upload.single('coverImage'), bookController.updateBook);

// Route xóa sách
router.post('/delete/:id', bookController.deleteBook);

// Route tìm kiếm sách
router.get('/search', bookController.searchBooks);

module.exports = router;