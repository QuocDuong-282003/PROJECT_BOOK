// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    phone: { type: String },
    address: { type: String },
    accessCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isAdmin: { type: Boolean, default: false },
    resetPasswordToken: String,
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    loginCount: { type: Number, default: 0 }, // Số lần đăng nhập
    lastLoginAt: Date, // Thời gian đăng nhập cuối cùng
    loginHistory: [{
        loginAt: { type: Date, default: Date.now }, // Lịch sử đăng nhập
    }],
}, { timestamps: true });

// Hash password trước khi lưu
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Kiểm tra mật khẩu
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema, 'users');