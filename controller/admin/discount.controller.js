const Discount = require('../../models/Discount');
const mongoose = require('mongoose');


// 📌 Lấy tất cả mã giảm giá
exports.getAllDiscounts = async (req, res) => {
    try {
        const discounts = await Discount.find();
        res.status(200).json({ success: true, data: discounts });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách mã giảm giá.', error: err.message });
    }
};

// 📌 Lấy một mã giảm giá theo ID
exports.getDiscountById = async (req, res) => {
    try {
        const discount = await Discount.findById(req.params.id);
        if (!discount) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy mã giảm giá.' });
        }
        res.status(200).json({ success: true, data: discount });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy mã giảm giá.', error: err.message });
    }
};

// 📌 Thêm mã giảm giá mới
exports.createDiscount = async (req, res) => {
    try {
        const { code, description, discountType, value, startDate, endDate } = req.body;

        if (!code || !discountType || !value || !startDate || !endDate) {
            return res.status(400).json({ success: false, message: 'Tất cả các trường đều bắt buộc.' });
        }

        const newDiscount = new Discount({ code, description, discountType, value, startDate, endDate });
        await newDiscount.save();

        res.status(201).json({ success: true, message: 'Thêm mã giảm giá thành công.', data: newDiscount });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server khi thêm mã giảm giá.', error: err.message });
    }
};

// 📌 Cập nhật mã giảm giá
exports.updateDiscount = async (req, res) => {
    try {
        const discountId = req.params.id;
        const updatedData = req.body;

        const discount = await Discount.findByIdAndUpdate(discountId, updatedData, { new: true });
        if (!discount) {
            return res.status(404).json({ success: false, message: 'Mã giảm giá không tồn tại.' });
        }

        res.status(200).json({ success: true, message: 'Cập nhật mã giảm giá thành công.', data: discount });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật mã giảm giá.', error: err.message });
    }
};

// 📌 Xóa mã giảm giá
exports.deleteDiscount = async (req, res) => {
    try {
        const discount = await Discount.findByIdAndDelete(req.params.id);
        if (!discount) {
            return res.status(404).json({ success: false, message: 'Mã giảm giá không tồn tại.' });
        }

        res.status(200).json({ success: true, message: 'Xóa mã giảm giá thành công.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server khi xóa mã giảm giá.', error: err.message });
    }
};

// 📌 Xóa mã giảm giá đã hết hạn
exports.deleteExpiredDiscounts = async () => {
    try {
        const now = new Date();
        const result = await Discount.deleteMany({ endDate: { $lt: now } });
        console.log(`🕰️ Đã xóa ${result.deletedCount} mã giảm giá hết hạn.`);
    } catch (err) {
        console.error('❌ Lỗi khi xóa mã giảm giá hết hạn:', err.message);
    }
};

// 📌 Chạy tự động lúc 0:00 mỗi ngày để xóa mã giảm giá hết hạn
exports.scheduleDeleteExpiredDiscounts = () => {
    cron.schedule('0 0 * * *', async () => {
        console.log('🕰️ Đang kiểm tra và xóa mã giảm giá hết hạn...');
        await exports.deleteExpiredDiscounts();
    });
};
