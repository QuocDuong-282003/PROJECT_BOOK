const express = require('express');
const router = express.Router();
const commentController = require('../../controller/admin/comment.controller');

// 🛠️ Định nghĩa các route
router.get('/', commentController.getAllComments); // Lấy danh sách bình luận
router.get('/stats', commentController.getCommentStatistics); // Thống kê số lượng bình luận
router.delete('/:id', commentController.deleteComment); // Xóa bình luận không phù hợp

module.exports = router;
