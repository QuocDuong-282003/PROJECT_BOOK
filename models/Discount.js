const mongoose = require('mongoose');
const discountSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    description: { type: String },
    discountType: { type: String, enum: ['percent', 'fixed'], required: true },
    value: { type: Number, required: true, min: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Discount', discountSchema);