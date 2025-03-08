const express = require('express');
const router = express.Router();
const bookController = require('../../controller/admin/book.controller');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

router.post('/', upload.single('coverImage'), bookController.createBook);

// 📌 Danh sách sách (Hiển thị trang admin EJS)
router.get('/', bookController.getBooks);

// 📌 Thêm sách
router.post('/', bookController.createBook);

// 📌 Cập nhật sách
router.put('/update/:id', bookController.updateBook);

// 📌 Xóa sách
router.delete('/:id', bookController.deleteBook);
router.get("/search", bookController.searchBooks);
module.exports = router;