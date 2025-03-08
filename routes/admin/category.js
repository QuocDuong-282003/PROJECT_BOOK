const express = require("express");
const router = express.Router();
const categoryController = require("../../controller/admin/category.controller");

// Hiển thị danh sách danh mục
router.get("/", categoryController.getCategories);
router.get("/search", categoryController.searchCategories);
// Thêm danh mục mới
router.post("/create", categoryController.createCategory);

// Chỉnh sửa danh mục
router.put("/edit/:id", categoryController.updateCategory);

// Xóa danh mục
router.delete("/delete/:id", categoryController.deleteCategory);

module.exports = router;