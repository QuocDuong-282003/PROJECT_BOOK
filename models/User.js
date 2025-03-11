const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    phone: { type: String },
    address: { type: String },
    accessCount: { type: Number, default: 0 }, // Thêm trường này
    isActive: { type: Boolean, default: true }, // Thêm trường này
    isAdmin: { type: Boolean, default: false }, // ✅ Thêm cờ xác định admin duy nhất
    resetPasswordToken: String

}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);
