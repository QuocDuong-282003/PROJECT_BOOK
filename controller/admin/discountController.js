// controllers/discountController.js
const Discount = require('../../models/Discount');
const mongoose = require('mongoose');
const cron = require('node-cron');


exports.renderDiscountPage = async (req, res, next) => {
    try {
        const discounts = await Discount.find();
        if (discounts.length === 0) {
            return res.render('discountAdmin', { title: 'Discounts', path: req.path, discounts, message: 'No discounts found.' });
        }
        res.render('discountAdmin', {
            title: 'Discounts', path: req.path, discounts,

        });
    } catch (err) {
        next(err);
    }
};
exports.createDiscount = async (req, res) => {
    try {
        const { code, description, discountType, value, startDate, endDate } = req.body;
        if (!code || !description || !discountType || !value || !startDate || !endDate) {
            return res.status(400).send('Tất cả các trường đều phải được điền');
        }
        const newDiscount = new Discount({ code, description, discountType, value, startDate, endDate });
        await newDiscount.save();
        res.redirect('/admin/discount');
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};
exports.updateDiscount = async (req, res) => {
    try {
        const discountId = req.params.id; // Lấy ID từ URL
        console.log("Updating Discount ID:", discountId);
        if (!discountId) {
            return res.status(400).json({ message: "Invalid discount ID" });
        }
        const { code, description, discountsType, value, startDate, endDate } = req.body;
        console.log("Request body:", req.body);

        const discount = await Discount.findById(discountId);
        if (!discount) {
            return res.status(404).json({ message: "Discount not found" });
        }
        // Cập nhật dữ liệu
        discount.code = code || discount.code;
        discount.description = description || discount.description;
        discount.discountType = discountsType || discount.discountType;
        discount.value = value || discount.value;
        discount.startDate = startDate ? new Date(startDate) : discount.startDate;
        discount.endDate = endDate ? new Date(endDate) : discount.endDate;
        await discount.save();

        console.log("Discount updated successfully!");
        res.redirect('/admin/discount');
    } catch (error) {
        console.error("Error updating discount:", error);
        res.status(500).json({ message: "Server error" });
    }
};




exports.deleteDiscount = async (req, res) => {
    try {
        const { id } = req.params;  // Lấy id từ tham số URL
        const discount = await Discount.findByIdAndDelete(id);  // Tìm và xóa discount theo id

        if (!discount) {
            return res.status(404).send('Discount không tồn tại');
        }

        // Sau khi xóa, chuyển hướng về danh sách discount
        res.redirect('/admin/discount');
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};
