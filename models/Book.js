const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  publisherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher' },
  discountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Discount' },
  price: {
    type: Number,
    required: true,
    min: 0,
    get: (v) => Math.round(v / 1000), // Chuyển đổi từ đồng sang nghìn đồng khi lấy dữ liệu
    set: (v) => Math.round(v * 1000), // Chuyển đổi từ nghìn đồng sang đồng khi lưu dữ liệu
  },
  stock: { type: Number, required: true, min: 0 },
  description: { type: String },
  coverImage: { type: String },
  averageRating: { type: Number, default: 0 }
}, {
  timestamps: true,
  toJSON: { getters: true }, // Đảm bảo getters được áp dụng khi chuyển đổi sang JSON
  toObject: { getters: true }, // Đảm bảo getters được áp dụng khi chuyển đổi sang object
});


module.exports = mongoose.model('Book', bookSchema);