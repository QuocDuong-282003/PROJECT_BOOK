const Book = require('../../models/Book');

// 📌 Hiển thị danh sách sách (chỉ lấy sách chưa bị xóa mềm)
exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find({ isDeleted: false }).populate("categoryId publisherId");
        res.render("admin/books/list", { books });
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

// 📌 Hiển thị trang thêm sách
exports.getAddBook = (req, res) => {
    res.render("admin/books/add");
};

// 📌 Thêm sách mới
exports.addBook = async (req, res) => {
    try {
        const { title, author, categoryId, publisherId, price, stock, description, coverImage } = req.body;
        const newBook = new Book({ title, author, categoryId, publisherId, price, stock, description, coverImage });
        await newBook.save();
        res.redirect("/admin/books");
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

// 📌 Hiển thị trang sửa sách
exports.getEditBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        res.render("admin/books/edit", { book });
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

// 📌 Cập nhật sách
exports.editBook = async (req, res) => {
    try {
        const { title, author, categoryId, publisherId, price, stock, description, coverImage } = req.body;
        await Book.findByIdAndUpdate(req.params.id, { title, author, categoryId, publisherId, price, stock, description, coverImage });
        res.redirect("/admin/books");
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

// 📌 Xóa mềm sách (ẩn sách thay vì xóa vĩnh viễn)
exports.softDeleteBook = async (req, res) => {
    try {
        await Book.findByIdAndUpdate(req.params.id, { isDeleted: true });
        res.redirect("/admin/books");
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

// 📌 Xóa vĩnh viễn sách
exports.hardDeleteBook = async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.redirect("/admin/books");
    } catch (err) {
        res.status(500).send("Server Error");
    }
};
