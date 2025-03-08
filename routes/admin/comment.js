const express = require('express');
const router = express.Router();
const commentController = require('../../controller/admin/comment.controller');

// 🛠️ Định nghĩa các route
router.get('/', commentController.getAllComments); // Lấy danh sách bình luận với phân trang
router.get('/stats', commentController.getCommentStatistics); // Thống kê số lượng bình luận
router.delete('/:id', commentController.deleteComment); // Xóa bình luận
router.get('/search', commentController.searchComments); // Tìm kiếm bình luận
router.put('/:id', commentController.updateComment); // Chỉnh sửa bình luận



module.exports = router;


