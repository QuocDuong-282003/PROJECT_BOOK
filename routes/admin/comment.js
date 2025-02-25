const express = require("express");
const { 
    getComments, 
    getAddComment, 
    addComment, 
    getEditComment, 
    editComment, 
    softDeleteComment, 
    hardDeleteComment 
} = require("../../controller/admin/comment.controller");

const router = express.Router();

// 📌 Hiển thị danh sách bình luận
router.get("/", getComments);

// 📌 Trang thêm bình luận
router.get("/add", getAddComment);
router.post("/add", addComment);

// 📌 Trang chỉnh sửa bình luận
router.get("/edit/:id", getEditComment);
router.post("/edit/:id", editComment);

// 📌 Xóa mềm bình luận (ẩn bình luận)
router.delete("/:id", softDeleteComment);

// 📌 Xóa vĩnh viễn bình luận
router.delete("/permanent/:id", hardDeleteComment);

module.exports = router;
