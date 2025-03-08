const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }, // Liên kết với mô hình Book
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } , // Liên kết với mô hình User
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }, 
}, { timestamps: true });
  

module.exports = mongoose.model("Comment", CommentSchema);
