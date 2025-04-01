
const Publisher = require('../../models/Publisher');
const mongoose = require('mongoose');
const cron = require('node-cron');
const Book = require('../../models/Book');
const Category = require('../../models/Category');
// exports.getPublishers = async (req, res) => {
//     try {
//         const publishers = await Publisher.find();
//         const categories = await Category.find();
//         for (let publisher of publishers) {
//             publisher.books = await Book.find({ publisherId: publisher._id });
//         }
//         res.render('publisherAdmin', {
//             title: 'Publisher',
//             path: req.path,
//             publishers,
//             categories,
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Error when getting list of publishers', error });
//     }
// };
exports.getPublishers = async (req, res) => {
    try {
        const publishers = await Publisher.find()
            .populate('categories'); // Populate danh mục từ mối quan hệ
        const categories = await Category.find();
        for (let publisher of publishers) {
            publisher.books = await Book.find({ publisherId: publisher._id });
        }
        res.render('publisherAdmin', {
            title: 'Publisher',
            path: req.path,
            publishers,
            categories,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error when getting list of publishers', error });
    }
};

// Thêm nhà xuất bản
exports.createPublisher = async (req, res) => {
    try {
        const { name, country, categories, dateCreated } = req.body;
        if (!name || !country || !categories || !dateCreated) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin!" });
        }
        // Kiểm tra xem nhà xuất bản đã tồn tại 
        const existingPublisher = await Publisher.findOne({ name });
        if (existingPublisher) {
            return res.status(400).json({ success: false, message: "Nhà xuất bản đã tồn tại!" });
        }
        // Kiểm tra xem categories có phải là mảng không, nếu không thì chuyển thành mảng
        const categoryArray = Array.isArray(categories) ? categories : [categories];
        // đổi  ID trong categories thành ObjectId
        const categoryIds = categoryArray.map(category => new mongoose.Types.ObjectId(category));
        const validCategories = await Category.find({ '_id': { $in: categoryIds } });
        if (validCategories.length !== categoryArray.length) {
            return res.status(400).json({ success: false, message: "Một hoặc nhiều danh mục không hợp lệ!" });
        }
        // Tạo nhà xuất bản mới
        const newPublisher = new Publisher({
            name,
            country,
            categories: validCategories.map(category => category._id),
            dateCreated
        });
        await newPublisher.save();
        res.redirect('/admin/publisher');
        // return res.status(201).json({ success: true, message: "Nhà xuất bản đã được thêm thành công!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Có lỗi xảy ra khi lưu nhà xuất bản." });
    }
};

// Cập nhật thông tin nhà xuất bản
exports.updatePublisher = async (req, res) => {
    try {
        const { name, country } = req.body;
        if (!name || !country) {
            return res.status(400).json({ message: "Tên nhà xuất bản và quốc gia là bắt buộc!" });
        }
        const publisher = await Publisher.findByIdAndUpdate(
            req.params.id,
            { name, country },
            { new: true }
        );
        if (!publisher) {
            return res.status(404).json({ message: "Không tìm thấy nhà xuất bản" });
        }
        // res.json({ success: true, message: "Nhà xuất bản đã được sửa thành công!", publisher });
        res.redirect('/admin/publisher');
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật nhà xuất bản", error });
    }
};


// Xóa nhà xuất bản và các sách liên quan
exports.deletePublisher = async (req, res) => {
    try {
        const publisher = await Publisher.findById(req.params.id);
        if (!publisher) return res.status(404).json({ message: "Không tìm thấy nhà xuất bản" });
        // Xóa tất cả sách của nhà xuất bản
        await Book.deleteMany({ publisherId: publisher._id });
        // Xóa nhà xuất bản
        await Publisher.findByIdAndDelete(req.params.id);
        res.redirect('/admin/publisher');
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa nhà xuất bản", error });
    }
};
