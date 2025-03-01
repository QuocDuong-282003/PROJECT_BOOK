const Book = require('../../models/Book');
const Category = require('../../models/Category');
const Publisher = require('../../models/Publisher');

// 📌 Lấy danh sách sách và hiển thị trên giao diện admin
exports.getBooks = async (req, res) => {   
    try {
        let page = parseInt(req.query.page) || 1; // Trang hiện tại
        let limit = 10; // Số sách mỗi trang
        let skip = (page - 1) * limit; // Số sách bỏ qua

        const books = await Book.find()
            .populate('categoryId publisherId')
            .skip(skip)
            .limit(limit);

        const totalBooks = await Book.countDocuments(); // Tổng số sách
        const totalPages = Math.ceil(totalBooks / limit); // Tổng số trang

        const categories = await Category.find();
        const publishers = await Publisher.find();

        res.render('admin/productsAdmin', { 
            title: 'Quản lý Sách', 
            books, 
            categories, 
            publishers,
            totalBooks, // 👈 Hiển thị tổng số sách
            totalPages, // 👈 Tổng số trang
            currentPage: page, // 👈 Trang hiện tại
            path: 'books' // 👈 Để menu hiển thị đúng
        });
    } catch (err) {
        console.error("Lỗi khi lấy danh sách sách:", err);
        res.status(500).send("Lỗi server khi lấy danh sách sách.");
    }
};


exports.createBook = async (req, res) => {
    try {
        const { title, author, categoryId, publisherId, price, stock, description } = req.body;

        const newBook = new Book({
            title,
            author,
            categoryId: categoryId || null,
            publisherId: publisherId || null,
            price: price || 0,
            stock: stock || 0,
            description: description || "Không có mô tả",
            coverImage: req.file ? `/uploads/${req.file.filename}` : "/uploads/default.jpg"
        });

        const savedBook = await newBook.save();
        const populatedBook = await savedBook.populate('categoryId publisherId'); // Lấy dữ liệu danh mục & NXB

        res.json({ success: true, book: populatedBook });
    } catch (err) {
        console.error("❌ Lỗi khi thêm sách:", err);
        res.status(500).json({ success: false, message: "Lỗi server khi thêm sách." });
    }
};


// 📌 Cập nhật sách từ form EJS
const mongoose = require("mongoose");

exports.updateBook = async (req, res) => {
    try {
        const bookId = req.params.id;

        // Kiểm tra ID sách hợp lệ
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({ success: false, message: "ID sách không hợp lệ!" });
        }

        // Lấy dữ liệu từ body
        const { title, author, categoryId, publisherId, price, stock, description, isDeleted } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!title || !author || !price || !stock) {
            return res.status(400).json({ success: false, message: "Dữ liệu không hợp lệ hoặc bị thiếu!" });
        }

        // Kiểm tra categoryId và publisherId có hợp lệ không
        const updateData = { title, author, price: parseFloat(price), stock: parseInt(stock), description, isDeleted };

        if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
            updateData.categoryId = categoryId;
        }

        if (publisherId && mongoose.Types.ObjectId.isValid(publisherId)) {
            updateData.publisherId = publisherId;
        }

        // Cập nhật sách
        const updatedBook = await Book.findByIdAndUpdate(bookId, updateData, { new: true });

        if (!updatedBook) {
            return res.status(404).json({ success: false, message: "Không tìm thấy sách!" });
        }

        res.json({ success: true, message: "Cập nhật sách thành công!", book: updatedBook });
    } catch (err) {
        console.error("Lỗi server khi cập nhật sách:", err);
        res.status(500).json({ success: false, message: "Lỗi server khi cập nhật sách.", error: err.message });
    }
};


// 📌 Xóa sách bằng phương thức DELETE
exports.deleteBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const deletedBook = await Book.findByIdAndDelete(bookId);

        if (!deletedBook) {
            return res.status(404).json({ success: false, message: "Không tìm thấy sách!" });
        }

        res.json({ success: true, message: "Xóa sách thành công!" });
    } catch (err) {
        console.error("Lỗi khi xóa sách:", err);
        res.status(500).json({ success: false, message: "Lỗi server khi xóa sách!" });
    }
};