const Comment = require('../../models/Comment');
const User = require('../../models/User');
const Book = require('../../models/Book');


// Lấy danh sách bình luận
exports.getAllComments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là 1
        const limit = 10; // Số bình luận hiển thị trên mỗi trang
        const skip = (page - 1) * limit; // Vị trí bắt đầu lấy dữ liệu

        // Lấy danh sách bình luận với phân trang và populate thông tin sách và người dùng
        const comments = await Comment.find()
            .skip(skip)
            .limit(limit)
            .populate('book', 'title') // Lấy thông tin sách (chỉ lấy trường 'title')
            .populate('user', 'name'); // Lấy thông tin người dùng (chỉ lấy trường 'name')
        console.log(comments);
        const totalComments = await Comment.countDocuments(); // Tổng số bình luận
        const totalPages = Math.ceil(totalComments / limit); // Tổng số trang

        res.render('admin/comments', {
            comments,
            totalComments,
            currentPage: page,
            totalPages,
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
      const commentId = req.params.id;
      await Comment.findByIdAndDelete(commentId);
      res.redirect("/admin/comment"); // Chuyển hướng về trang danh sách bình luận
  } catch (err) {
      res.status(500).send("Lỗi server khi xóa bình luận.");
  }
};

exports.searchComments = async (req, res) => {
  try {
      const query = req.query.query;
      const comments = await Comment.find({
          content: { $regex: query, $options: "i" }
      })
          .populate("user", "name")
          .populate("book", "title");

      res.render("admin/comments", {
          comments,
          totalComments: comments.length,
          currentPage: 1,
          totalPages: 1,
          title: "Kết quả tìm kiếm",
          path: "comments",
      });
  } catch (err) {
      res.status(500).send("Lỗi server khi tìm kiếm bình luận.");
  }
};

// 📌 Chỉnh sửa bình luận
exports.updateComment = async (req, res) => {
  try {
      const { content } = req.body;
      const commentId = req.params.id;
      await Comment.findByIdAndUpdate(commentId, { content });
      res.redirect("/admin/comment"); // Chuyển hướng về trang danh sách bình luận
  } catch (err) {
      res.status(500).send("Lỗi server khi cập nhật bình luận.");
  }
};
