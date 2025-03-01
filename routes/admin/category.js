const express = require("express");
const router = express.Router();
const categoryController = require("../../controller/admin/category.controller");

router.get("/", categoryController.getCategories);
router.post("/create", categoryController.createCategory);
router.put("/edit/:id", categoryController.updateCategory);
router.delete("/delete/:id", categoryController.deleteCategory);
router.get("/statistics", categoryController.getCategoryStatistics);

module.exports = router;
