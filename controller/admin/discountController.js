
const Discount = require('../../models/Discount');
const mongoose = require('mongoose');
const cron = require('node-cron');
const Book = require('../../models/Book');

exports.renderDiscountPage = async (req, res, next) => {
    try {
        const perPage = 10; // Số lượng discount trên mỗi trang
        const page = parseInt(req.query.page) || 1; // Lấy số trang từ query, mặc định là 1
        // Đếm tổng số discount
        const totalDiscounts = await Discount.countDocuments();
        const totalPages = Math.ceil(totalDiscounts / perPage); // Tính tổng số trang
        const books = await Book.find().lean();
        const discounts = await Discount.find()
            .skip((page - 1) * perPage) // bỏ qua sl bản ghi 
            .limit(perPage);// lấy bản ghi tiếp theo
        // Nếu không có discount nào
        if (discounts.length === 0) {
            return res.render('discountAdmin', {
                title: 'Discounts',
                path: req.path,
                discounts,
                message: 'No discounts found.',
                currentPage: page,
                totalPages: '',
                books,
            });
        }
        // Render trang với danh sách discount
        res.render('discountAdmin', {
            title: 'Discounts',
            path: req.path,
            discounts,
            currentPage: page,
            totalPages,
            message: '',
            books,
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
        const discountId = req.params.id;
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
// delete giảm giá dã hết hạn
exports.deleteExpiredDiscounts = async () => {
    try {
        const now = new Date();
        const result = await Discount.deleteMany({ endDate: { $lt: now } }); // Xóa mã hết hạn
        console.log(` Đã xóa ${result.deletedCount} mã giảm giá hết hạn.`);
    } catch (err) {
        console.error(' Lỗi khi xóa mã giảm giá hết hạn:', err.message);
    }
};
// Chạy tự động lúc 0:00 mỗi ngày
exports.scheduleDeleteExpiredDiscounts = () => {
    cron.schedule('0 0 * * *', async () => {
        console.log(' Đang kiểm tra và xóa mã giảm giá hết hạn...');
        await exports.deleteExpiredDiscounts();
    });
};
// search
exports.getDiscounts = async (req, res) => {
    try {
        let searchQuery = req.query.search || ''; // Lấy giá trị tìm kiếm từ query string
        let page = parseInt(req.query.page) || 1; // Lấy số trang từ query string, mặc định là 1
        let limit = 10; // Số lượng kết quả trên mỗi trang
        let skip = (page - 1) * limit; // Tính vị trí bỏ qua

        let filter = {}; // Điều kiện tìm kiếm mặc định (lấy tất cả)
        if (searchQuery) {
            filter = {
                code: { $regex: searchQuery, $options: 'i' }
            };
        }

        //  tổng số lượng discount để tính tổng số trang
        const totalDiscounts = await Discount.countDocuments(filter);
        const totalPages = Math.ceil(totalDiscounts / limit);

        // Truy vấn MongoDB ,tìm kiếm, phân trang
        const discounts = await Discount.find(filter).skip(skip).limit(limit);

        res.render('discountAdmin', {
            discounts,
            searchQuery,
            currentPage: page,
            totalPages,
            title: "Quản lý Mã Giảm Giá",
            path: "discounts"
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi Server");
    }
};
//
