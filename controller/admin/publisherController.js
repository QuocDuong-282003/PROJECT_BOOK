
const Publisher = require('../../models/Publisher');
const mongoose = require('mongoose');
const cron = require('node-cron');
const Book = require('../../models/Book');
exports.getPublishers = async (req, res) => {
    try {
        // Get the current page from query, default to page 1 if not provided
        const page = parseInt(req.query.page) || 1;
        const limit = 10;  // Number of publishers per page

        // Fetch all publishers from the database with pagination
        const publishers = await Publisher.find()
            .skip((page - 1) * limit)   // Skip previous pages
            .limit(limit);  // Limit the number of publishers per page

        // Get the total number of publishers to calculate total pages
        const totalPublishers = await Publisher.countDocuments();
        const totalPages = Math.ceil(totalPublishers / limit);

        // Fetch books for each publisher
        for (let publisher of publishers) {
            publisher.books = await Book.find({ publisherId: publisher._id });
        }

        // Render the publisherAdmin page and pass the publishers to it
        return res.render('publisherAdmin', {
            title: 'Publisher',
            path: req.path,
            publishers,
            message: 'No publishers found.',
            currentPage: page,
            totalPages
        });
    } catch (error) {
        res.status(500).json({ message: 'Error when getting list of publishers', error });
    }
};

// Thêm nhà xuất bản
exports.createPublisher = async (req, res) => {
    try {
        const { name, country } = req.body;
        const newPublisher = new Publisher({ name, country });
        await newPublisher.save();
        res.status(201).json(newPublisher);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi thêm nhà xuất bản", error });
    }
};
// Cập nhật thông tin nhà xuất bản
exports.updatePublisher = async (req, res) => {
    try {
        const { name, country } = req.body;
        const publisher = await Publisher.findByIdAndUpdate(
            req.params.id,
            { name, country },
            { new: true }
        );

        if (!publisher) return res.status(404).json({ message: "Không tìm thấy nhà xuất bản" });

        res.json(publisher);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật nhà xuất bản", error });
    }
};

// Xóa nhà xuất bản và các sách liên quan
exports.deletePublisher = async (req, res) => {
    try {
        const publisher = await Publisher.findById(req.params.id);
        if (!publisher) return res.status(404).json({ message: "Không tìm thấy nhà xuất bản" });

        // Xóa tất cả sách của nhà xuất bản này
        await Book.deleteMany({ publisherId: publisher._id });

        // Xóa nhà xuất bản
        await Publisher.findByIdAndDelete(req.params.id);

        res.json({ message: "Xóa thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa nhà xuất bản", error });
    }
};
