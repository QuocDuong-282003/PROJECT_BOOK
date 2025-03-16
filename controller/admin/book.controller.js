const Book = require('../../models/Book');
const Category = require('../../models/Category');
const Publisher = require('../../models/Publisher');

// Lấy danh sách sách
exports.getBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const books = await Book.find().populate('categoryId publisherId').skip(skip).limit(limit);
        const totalBooks = await Book.countDocuments();
        const totalPages = Math.ceil(totalBooks / limit);

        const categories = await Category.find();
        const publishers = await Publisher.find();

        res.render('admin/book/productsAdmin', {
            title: 'Quản lý Sách',
            path: 'books', // Thêm biến path
            books,
            categories,
            publishers,
            totalBooks,
            totalPages,
            currentPage: page
        });
    } catch (err) {
        console.error("Lỗi khi lấy danh sách sách:", err);
        res.status(500).send("Lỗi server khi lấy danh sách sách.");
    }
};
// Thêm sách
exports.createBook = async (req, res) => {
    try {
        const { title, author, categoryId, publisherId, price, stock, description } = req.body;
        const newBook = new Book({
            title,
            author,
            categoryId,
            publisherId,
            price,
            stock,
            description,
            coverImage: req.file ? `/uploads/${req.file.filename}` : "/uploads/default.jpg"
        });
        await newBook.save();
        res.redirect('/admin/books');
    } catch (err) {
        console.error("Lỗi khi thêm sách:", err);
        res.status(500).send("Lỗi server khi thêm sách.");
    }
};

// Cập nhật sách
exports.updateBook = async (req, res) => {
    try {
        const { title, author, categoryId, publisherId, price, stock, description } = req.body;
        const updateData = {
            title,
            author,
            categoryId,
            publisherId,
            price,
            stock,
            description,
            coverImage: req.file ? `/uploads/${req.file.filename}` : req.body.oldCoverImage
        };
        await Book.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/admin/books');
    } catch (err) {
        console.error("Lỗi khi cập nhật sách:", err);
        res.status(500).send("Lỗi server khi cập nhật sách.");
    }
};

// Xóa sách
exports.deleteBook = async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.redirect('/admin/books');
    } catch (err) {
        console.error("Lỗi khi xóa sách:", err);
        res.status(500).send("Lỗi server khi xóa sách.");
    }
};

// Tìm kiếm sách
exports.searchBooks = async (req, res) => {
    try {
        const query = req.query.query;
        const books = await Book.find({
            $or: [
                { title: new RegExp(query, "i") },
                { author: new RegExp(query, "i") }
            ]
        }).populate('categoryId publisherId');

        res.render('admin/book/productsAdmin', {
            title: 'Kết quả tìm kiếm',
            books,
            categories: await Category.find(),
            publishers: await Publisher.find(),
            totalBooks: books.length,
            totalPages: 1,
            currentPage: 1
        });
    } catch (err) {
        console.error("Lỗi khi tìm kiếm sách:", err);
        res.status(500).send("Lỗi server khi tìm kiếm sách.");
    }
};