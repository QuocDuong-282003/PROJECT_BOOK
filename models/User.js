// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    // _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: Number, enum: [0, 1], default: 0},
    phone: { type: String },
    address: { type: String },
    accessCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isAdmin: { type: Boolean, default: false },
    resetPasswordToken: String,
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
    const result = await bcrypt.compare(enteredPassword, this.password);
    return result;
};

module.exports = mongoose.model('User', userSchema, 'users');




