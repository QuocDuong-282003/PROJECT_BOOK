const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }, // Liên kết với mô hình Book
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Liên kết với mô hình User
    rating: { type: Number, min: 1, max: 5 }, // Đánh giá từ 1 đến 5
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Comment", CommentSchema);