const express = require("express");
const router = express.Router();
const categoryController = require("../../controller/admin/category.controller");

// Hiển thị danh sách danh mục
router.get("/", categoryController.getCategories);

// Tìm kiếm danh mục
router.get("/search", categoryController.searchCategories);

// Thêm danh mục mới
router.post("/create", categoryController.createCategory);

// Cập nhật danh mục
router.post("/update/:id", categoryController.updateCategory);

// Xóa danh mục
router.post("/delete/:id", categoryController.deleteCategory);

module.exports = router;