const express = require("express");
const router = express.Router();
const commentController = require("../../controller/admin/comment.controller");

// Hiển thị danh sách bình luận
router.get("/", commentController.getAllComments);

// Xóa bình luận
router.post("/delete/:id", commentController.deleteComment);

// Chỉnh sửa bình luận
router.post("/update/:id", commentController.updateComment);

// Tìm kiếm bình luận
router.get("/search", commentController.searchComments);

module.exports = router;