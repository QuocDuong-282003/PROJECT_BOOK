const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    orderId: {type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    discountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Discount', default: null },
    address: { type: String, required: true },
    // address2: { type: String, default: null },
    ward: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
    status: { type: Number, enum: [0, 1, -1], default: 0 },// 0: pending, 1: delivered, -1: cancelled
    paymentMethod: { type: String, required: true },
    items: [
            {
                bookId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Book",
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },
                price: {
                    type: Number,
                    required: true
                }
            }
        ]

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);