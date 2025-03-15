const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

