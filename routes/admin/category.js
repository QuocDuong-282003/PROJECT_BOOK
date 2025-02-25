const express = require('express');
const {
    getCategories,
    getAddCategoryPage,
    addCategory,
    getEditCategoryPage,
    editCategory,
    deleteCategory
} = require("../../controller/admin/category.controller");

const router = express.Router();

// 🔹 Route quản lý danh mục
router.get("/", getCategories);               // Hiển thị danh sách danh mục
router.get("/add", getAddCategoryPage);       // Trang thêm danh mục
router.post("/add", addCategory);             // Xử lý thêm danh mục
router.get("/edit/:id", getEditCategoryPage); // Trang chỉnh sửa danh mục
router.post("/edit/:id", editCategory);       // Xử lý chỉnh sửa danh mục
router.delete("/delete/:id", deleteCategory); // Xóa danh mục

module.exports = router;
