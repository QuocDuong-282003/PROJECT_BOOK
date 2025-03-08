const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'categories', required: true },
    publisherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher', required: true },
    discountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Discount', default: null },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    description: { type: String },
    coverImage: { type: String },
    averageRating: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
