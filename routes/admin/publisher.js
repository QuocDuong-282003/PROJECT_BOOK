const express = require("express");
const router = express.Router();
const publisherController = require("../../controller/admin/publish.controller");

router.get("/", publisherController.getAllPublishers);   // 📌 Lấy danh sách nhà xuất bản
router.post("/", publisherController.createPublisher);  // 📌 Thêm nhà xuất bản mới
router.put("/:id", publisherController.updatePublisher); // 📌 Cập nhật nhà xuất bản
router.delete("/:id", publisherController.deletePublisher); // 📌 Xóa nhà xuất bản

module.exports = router;
