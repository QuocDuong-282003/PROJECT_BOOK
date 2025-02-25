const express = require('express');
const router = express.Router();
const {
    getBooks,
    getAddBook,
    addBook,
    getEditBook,
    editBook,
    softDeleteBook,
    hardDeleteBook
} = require('../../controller/admin/book.controller');

// 🔹 Routes quản lý sách
router.get("/", getBooks);           // Hiển thị danh sách sách
router.get("/add", getAddBook);      // Trang thêm sách
router.post("/add", addBook);        // Xử lý thêm sách
router.get("/edit/:id", getEditBook); // Trang sửa sách
router.post("/edit/:id", editBook);  // Xử lý sửa sách
router.delete("/delete/:id", softDeleteBook);  // Xóa mềm
router.delete("/permanent/:id", hardDeleteBook); // Xóa vĩnh viễn

module.exports = router;
