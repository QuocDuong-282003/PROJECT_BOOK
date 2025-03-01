const Comment = require('../../models/Comment');
const User = require('../../models/User');
const Book = require('../../models/Book');

// 📌 Lấy danh sách tất cả bình luận
exports.getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find().populate('user', 'username').populate('book', 'title');
        res.status(200).json({ success: true, data: comments });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách bình luận.', error: err.message });
    }
};

// 📌 Xóa bình luận theo ID
exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);
        if (!comment) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy bình luận.' });
        }
        res.status(200).json({ success: true, message: 'Xóa bình luận thành công.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server khi xóa bình luận.', error: err.message });
    }
};

// 📌 Thống kê số lượng bình luận
exports.getCommentStatistics = async (req, res) => {
    try {
        const totalComments = await Comment.countDocuments();
        res.status(200).json({ success: true, data: { totalComments } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy thống kê bình luận.', error: err.message });
    }
};
