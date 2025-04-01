
const Publisher = require('../../models/Publisher');
const mongoose = require('mongoose');
const cron = require('node-cron');
const Book = require('../../models/Book');
const Category = require('../../models/Category');

exports.getPublishers = async (req, res) => {
    try {
        const perPage = 10; // Số lượng publisher trên mỗi trang
        const page = parseInt(req.query.page) || 1; // Lấy số trang từ query, mặc định là 1

        // Lấy tổng số publisher
        const totalPublisher = await Publisher.countDocuments();
        const totalPages = Math.ceil(totalPublisher / perPage); // Tính tổng số trang

        // Lấy danh mục trước để tránh lỗi
        const categories = await Category.find();

        // Lấy danh sách publishers với phân trang
        const publishers = await Publisher.find()
            .skip((page - 1) * perPage)
            .limit(perPage)
            .populate('categories'); // Populate danh mục từ mối quan hệ

        // Lấy danh sách sách cho từng publisher
        const publishersWithBooks = await Promise.all(
            publishers.map(async (publisher) => {
                const books = await Book.find({ publisherId: publisher._id });
                return { ...publisher.toObject(), books }; // Chuyển về object để tránh sửa trực tiếp
            })
        );

        res.render('publisherAdmin', {
            title: 'Publisher',
            path: req.path,
            publishers: publishersWithBooks,
            categories,
            message: publishers.length === 0 ? 'No publishers found.' : '',
            currentPage: page,
            totalPages
        });
    } catch (error) {
        console.error(error);
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
        await Book.deleteMany({ publisherId: publisher._id });
        await Publisher.findByIdAndDelete(req.params.id);
        res.redirect('/admin/publisher');
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa nhà xuất bản", error });
    }
};
// search
exports.getSearchPublishers = async (req, res) => {
    try {
        let searchQuery = req.query.search || '';
        let page = parseInt(req.query.page) || 1;
        let limit = 10;
        let skip = (page - 1) * limit;
        let filter = {};
        // Lấy danh sách nhà xuất bản theo thứ tự tạo
        const allPublishers = await Publisher.find().sort({ createdAt: 1 });
        let searchedPublisher = null;
        let searchedSTT = null;
        if (!isNaN(searchQuery) && searchQuery > 0) {
            let index = parseInt(searchQuery) - 1; // Chuyển STT về index (bắt đầu từ 0)
            if (index >= 0 && index < allPublishers.length) {
                searchedPublisher = allPublishers[index];
                filter = { _id: searchedPublisher._id };
                searchedSTT = searchQuery; // Lưu STT tìm kiếm
            } else {
                const categories = await Category.find();
                return res.render('publisherAdmin', {
                    publishers: [],
                    categories,
                    searchQuery,
                    searchedSTT: null,
                    currentPage: page,
                    totalPages: 0,
                    title: "Publisher",
                    path: "publisher"
                });
            }
        }
        // Lấy tổng số nhà xuất bản phù hợp
        const totalPublisher = await Publisher.countDocuments(filter);
        const totalPages = Math.ceil(totalPublisher / limit);

        // Lấy danh sách nhà xuất bản theo phân trang
        let publishers = await Publisher.find(filter)
            .skip(skip)
            .limit(limit)
            .populate('categories');
        const categories = await Category.find();

        // Lấy danh sách sách của từng nhà xuất bản
        for (let publisher of publishers) {
            publisher.books = await Book.find({ publisherId: publisher._id });
        }
        res.render('publisherAdmin', {
            publishers,
            categories,
            searchQuery,
            searchedSTT,
            currentPage: page,
            totalPages,
            title: "Publisher",
            path: "publisher"
        });
    } catch (error) {
        console.error("Lỗi chi tiết:", error);
        res.status(500).send("Lỗi Server");
    }
};
