const Comment = require('../../models/Comment');
const User = require('../../models/User');
const Book = require('../../models/Book');

// 📌 Lấy danh sách tất cả bình luận và render EJS
exports.getAllComments = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là 1
      const limit = 10; // Số bình luận hiển thị trên mỗi trang
      const skip = (page - 1) * limit; // Vị trí bắt đầu lấy dữ liệu
  
      // Lấy danh sách bình luận với phân trang
      const comments = await Comment.find()
        .skip(skip)
        .limit(limit)
        .populate('user', 'name email') // Lấy thông tin người dùng
        .populate('book', 'title author'); // Lấy thông tin sách
  
      const totalComments = await Comment.countDocuments(); // Tổng số bình luận
      const totalPages = Math.ceil(totalComments / limit); // Tổng số trang
  
      res.render('admin/comments', {
        comments,
        totalComments,
        currentPage: page, // Trang hiện tại
        totalPages, // Tổng số trang
        title: 'Quản lý Bình luận',
        path: 'comments'
      });
    } catch (err) {
      res.status(500).send({
        message: 'Lỗi server khi lấy danh sách bình luận.',
        error: err.message
      });
    }
};

// 📌 Xóa bình luận theo ID
exports.deleteComment = async (req, res) => {
    try {
      const comment = await Comment.findByIdAndDelete(req.params.id);
      if (!comment) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy bình luận.'
        });
      }
      res.status(200).json({
        success: true,
        message: 'Xóa bình luận thành công.'
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi xóa bình luận.',
        error: err.message
      });
    }
};

// 📌 Tìm kiếm bình luận
exports.searchComments = async (req, res) => {
    try {
      const { query } = req.query;
      const comments = await Comment.find({
        content: { $regex: query, $options: 'i' }
      })
        .populate('user', 'name')
        .populate('book', 'title');
  
      res.json({
        success: true,
        comments,
        totalComments: comments.length
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi tìm kiếm bình luận.',
        error: err.message
      });
    }
};

// 📌 Chỉnh sửa bình luận
exports.updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true }
    );
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bình luận.'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Cập nhật bình luận thành công.',
      comment
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật bình luận.',
      error: err.message
    });
  }
};
// 📌 Thống kê số lượng bình luận (API để sử dụng trong EJS)
exports.getCommentStatistics = async (req, res) => {
  try {
    const totalComments = await Comment.countDocuments();
    res.status(200).json({
      success: true,
      data: { totalComments }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thống kê bình luận.',
      error: err.message
    });
  }
};
