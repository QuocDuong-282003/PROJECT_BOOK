const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    publisherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher', required: true },
    discountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Discount', default: null },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    description: { type: String },
    coverImage: { type: String, default: "default-cover.jpg" }, // Ảnh mặc định
    averageRating: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false } 
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
