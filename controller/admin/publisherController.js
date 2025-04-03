const Publisher = require('../../models/Publisher');
const mongoose = require('mongoose');
const Book = require('../../models/Book');
// const Category = require('../../models/Category'); // Comment lại phần lấy danh mục

exports.getPublishers = async (req, res) => {
    try {
        const perPage = 10;
        const page = parseInt(req.query.page) || 1;

        const totalPublisher = await Publisher.countDocuments();
        const totalPages = Math.ceil(totalPublisher / perPage);

        const publishers = await Publisher.find()
            .skip((page - 1) * perPage)
            .limit(perPage);

        const publishersWithBooks = await Promise.all(
            publishers.map(async (publisher) => {
                const books = await Book.find({ publisherId: publisher._id });
                return { ...publisher.toObject(), books };
            })
        );

        res.render('publisherAdmin', {
            title: 'Publisher',
            path: req.path,
            publishers: publishersWithBooks,
            // categories: [], // Không lấy categories nữa
            message: publishers.length === 0 ? 'No publishers found.' : '',
            currentPage: page,
            totalPages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error when getting list of publishers', error });
    }
};

exports.createPublisher = async (req, res) => {
    try {
        const { name, country, categories } = req.body;
        if (!name || !country) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin!" });
        }

        const existingPublisher = await Publisher.findOne({ name });
        if (existingPublisher) {
            return res.status(400).json({ success: false, message: "Nhà xuất bản đã tồn tại!" });
        }
        // Lấy thời gian thực khi tạo
        const dateCreated = new Date();
        const newPublisher = new Publisher({
            name,
            country,
            // categories: [], 
            dateCreated
        });

        await newPublisher.save();
        res.redirect('/admin/publisher');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Có lỗi xảy ra khi lưu nhà xuất bản." });
    }
};

// Cập nhật nhà xuất bản
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

// Xóa nhà xuất bản và sách liên quan
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

// Tìm kiếm nhà xuất bản
exports.getSearchPublishers = async (req, res) => {
    try {
        let searchQuery = req.query.search || '';
        let page = parseInt(req.query.page) || 1;
        let limit = 10;
        let skip = (page - 1) * limit;
        let filter = {};

        const allPublishers = await Publisher.find().sort({ createdAt: 1 });
        let searchedPublisher = null;
        let searchedSTT = null;

        if (!isNaN(searchQuery) && searchQuery > 0) {
            let index = parseInt(searchQuery) - 1;
            if (index >= 0 && index < allPublishers.length) {
                searchedPublisher = allPublishers[index];
                filter = { _id: searchedPublisher._id };
                searchedSTT = searchQuery;
            } else {
                return res.render('publisherAdmin', {
                    publishers: [],
                    // categories: [], // Không lấy categories
                    searchQuery,
                    searchedSTT: null,
                    currentPage: page,
                    totalPages: 0,
                    title: "Publisher",
                    path: "publisher"
                });
            }
        }

        const totalPublisher = await Publisher.countDocuments(filter);
        const totalPages = Math.ceil(totalPublisher / limit);

        let publishers = await Publisher.find(filter)
            .skip(skip)
            .limit(limit);

        for (let publisher of publishers) {
            publisher.books = await Book.find({ publisherId: publisher._id });
        }

        res.render('publisherAdmin', {
            publishers,
            // categories: [], // Không lấy categories
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
