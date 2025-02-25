const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    discountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Discount', default: null },
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
    paymentMethod: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);