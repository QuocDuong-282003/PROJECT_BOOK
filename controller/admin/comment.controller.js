const Comment = require('../../models/Comment');

// 📌 Hiển thị danh sách bình luận (chỉ lấy bình luận chưa bị xóa mềm)
exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ isDeleted: false }).populate("userId bookId");
        res.render("admin/comments/list", { comments });
    } catch (err) {
        res.status(500).send("Lỗi server khi lấy danh sách bình luận.");
    }
};

// 📌 Hiển thị trang thêm bình luận
exports.getAddComment = (req, res) => {
    res.render("admin/comments/add");
};

// 📌 Thêm bình luận mới
exports.addComment = async (req, res) => {
    try {
        const { userId, bookId, content } = req.body;
        const newComment = new Comment({ userId, bookId, content });
        await newComment.save();
        res.redirect("/admin/comments");
    } catch (err) {
        res.status(500).send("Lỗi server khi thêm bình luận.");
    }
};

// 📌 Hiển thị trang chỉnh sửa bình luận
exports.getEditComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        res.render("admin/comments/edit", { comment });
    } catch (err) {
        res.status(500).send("Lỗi server khi lấy dữ liệu bình luận.");
    }
};

// 📌 Cập nhật bình luận
exports.editComment = async (req, res) => {
    try {
        const { content } = req.body;
        await Comment.findByIdAndUpdate(req.params.id, { content });
        res.redirect("/admin/comments");
    } catch (err) {
        res.status(500).send("Lỗi server khi cập nhật bình luận.");
    }
};

// 📌 Xóa mềm bình luận (ẩn bình luận thay vì xóa vĩnh viễn)
exports.softDeleteComment = async (req, res) => {
    try {
        await Comment.findByIdAndUpdate(req.params.id, { isDeleted: true });
        res.redirect("/admin/comments");
    } catch (err) {
        res.status(500).send("Lỗi server khi ẩn bình luận.");
    }
};

// 📌 Xóa vĩnh viễn bình luận
exports.hardDeleteComment = async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.id);
        res.redirect("/admin/comments");
    } catch (err) {
        res.status(500).send("Lỗi server khi xóa bình luận.");
    }
};
