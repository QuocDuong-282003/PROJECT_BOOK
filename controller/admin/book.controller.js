const Book = require('../../models/Book');
const Category = require('../../models/Category');
const Publisher = require('../../models/Publisher');
const Discount = require('../../models/Discount');
const Image = require("../../models/Image");
// Lấy danh sách sách
exports.getBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const books = await Book.find().populate('categoryId publisherId').skip(skip).limit(limit);
        for (const book of books) {
            if (book.note && book.note.includes("Mã:")) {
                const match = book.note.match(/Mã:.*?(?:Phần trăm|Cố định) - ([\d.]+)(%|đ)/);
                if (match) {
                    const value = parseFloat(match[1]);
                    const type = match[2];
                    book.hasDiscount = true;
                    book.originalPrice = book.price;

                    if (type === '%') {
                        book.discountedPrice = book.price * (1 - value / 100);
                    } else {
                        book.discountedPrice = book.price - value;
                    }
                }
            }
        }
        const totalBooks = await Book.countDocuments();
        const totalPages = Math.ceil(totalBooks / limit);
        const categories = await Category.find();
        const publishers = await Publisher.find();
        const discounts = await Discount.find();
        res.render('admin/book/productsAdmin', {
            title: 'Quản lý Sách',
            path: 'books', // Thêm biến path
            books,
            categories,
            publishers,
            discounts,
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
// exports.createBook = async (req, res) => {
//     try {
//         const { title, author, categoryId, publisherId, price, stock, description } = req.body;
//         const newBook = new Book({
//             title,
//             author,
//             categoryId,
//             publisherId,
//             price: parseFloat(price), // Giá tiền được nhập dưới dạng nghìn đồng
//             stock,
//             description,
//             coverImage: req.file ? `/uploads/${req.file.filename}` : "/uploads/default.jpg"
//         });
//         await newBook.save();
//         res.redirect('/admin/books');
//     } catch (err) {
//         console.error("Lỗi khi thêm sách:", err);
//         res.status(500).send("Lỗi server khi thêm sách.");
//     }
// };

// exports.updateBook = async (req, res) => {
//     try {
//         const { title, author, categoryId, publisherId, price, stock, description } = req.body;
//         const updateData = {
//             title,
//             author,
//             categoryId,
//             publisherId,
//             price: parseFloat(price), // Giá tiền được nhập dưới dạng nghìn đồng
//             stock,
//             description,
//             coverImage: req.file ? `/uploads/${req.file.filename}` : req.body.oldCoverImage
//         };
//         await Book.findByIdAndUpdate(req.params.id, updateData);
//         res.redirect('/admin/books');
//     } catch (err) {
//         console.error("Lỗi khi cập nhật sách:", err);
//         res.status(500).send("Lỗi server khi cập nhật sách.");
//     }
// };
// Xóa sách
exports.createBook = async (req, res) => {
    try {
        const { title, author, categoryId, publisherId, price, stock, description } = req.body;

        // Nếu có ảnh gửi lên, convert buffer -> base64 string
        // coverImage vẫn ở req.files['coverImage'][0]
        let coverImageBase64 = "";
        if (req.files && req.files['coverImage']) {
            const file = req.files['coverImage'][0];
            const mimeType = file.mimetype;
            coverImageBase64 = `data:${mimeType};base64,${file.buffer.toString("base64")}`;
        }

        // ảnh phụ
        const imageFiles = req.files['Image'] || [];
        const imagesBase64 = imageFiles.map(file => {
            return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
        });


        const newBook = new Book({
            title,
            author,
            categoryId,
            publisherId,
            price: parseFloat(price),
            stock,
            description,
            coverImage: coverImageBase64 || "", // lưu base64
            images: imagesBase64, 
        });

        await newBook.save();
        res.redirect('/admin/books');
    } catch (err) {
        console.error("Lỗi khi thêm sách:", err);
        res.status(500).send("Lỗi server khi thêm sách.");
    }
};

// exports.updateBook = async (req, res) => {
//     try {
//         const { title, author, categoryId, publisherId, price, stock, description, oldCoverImage } = req.body;

//         const book = await Book.findById(req.params.id);
//         if (!book) return res.status(404).send("Sách không tồn tại!");

//         let newCover = oldCoverImage;
//         if (req.file) {
//             // Xoá ảnh cũ nếu không phải mặc định
//             if (book.coverImage && book.coverImage !== '/uploads/default.jpg') {
//                 const imagePath = path.join(__dirname, '../../public', book.coverImage);
//                 if (fs.existsSync(imagePath)) {
//                     fs.unlinkSync(imagePath);
//                 }
//             }
//             newCover = `/uploads/${req.file.filename}`;
//         }

//         await Book.findByIdAndUpdate(req.params.id, {
//             title,
//             author,
//             categoryId,
//             publisherId,
//             price: parseFloat(price),
//             stock,
//             description,
//             coverImage: newCover
//         });

//         res.redirect('/admin/books');
//     } catch (err) {
//         console.error("Lỗi khi cập nhật sách:", err);
//         res.status(500).send("Lỗi server khi cập nhật sách.");
//     }
// };

// exports.deleteBook = async (req, res) => {
//     try {
//         await Book.findByIdAndDelete(req.params.id);
//         res.redirect('/admin/books');
//     } catch (err) {
//         console.error("Lỗi khi xóa sách:", err);
//         res.status(500).send("Lỗi server khi xóa sách.");
//     }
// };

// Tìm kiếm sách
exports.updateBook = async (req, res) => {
    try {
        const { title, author, categoryId, publisherId, price, stock, description, oldCoverImage } = req.body;

        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).send("Sách không tồn tại!");

        let newCoverImage = oldCoverImage;

        if (req.file) {
            // Nếu có ảnh mới thì convert buffer sang base64
            const mimeType = req.file.mimetype;
            newCoverImage = `data:${mimeType};base64,${req.file.buffer.toString("base64")}`;
        }

        await Book.findByIdAndUpdate(req.params.id, {
            title,
            author,
            categoryId,
            publisherId,
            price: parseFloat(price),
            stock,
            description,
            coverImage: newCoverImage,
        });

        res.redirect('/admin/books');
    } catch (err) {
        console.error("Lỗi khi cập nhật sách:", err);
        res.status(500).send("Lỗi server khi cập nhật sách.");
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).send("Không tìm thấy sách");

        // Xoá ảnh
        if (book.coverImage && book.coverImage !== '/uploads/default.jpg') {
            const imagePath = path.join(__dirname, '../../public', book.coverImage);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Book.findByIdAndDelete(req.params.id);
        res.redirect('/admin/books');
    } catch (err) {
        console.error("Lỗi khi xóa sách:", err);
        res.status(500).send("Lỗi server khi xóa sách.");
    }
};

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
//
exports.assignDiscountToBook = async (req, res) => {
    const { bookId, discountId } = req.body;

    try {
        const discount = await Discount.findById(discountId);
        if (!discount) {
            return res.status(404).send('Discount not found');
        }
        // Tạo chuỗi ghi chú từ discount
        const note = `Mã: ${discount.code} - ${discount.description} - ${discount.discountType === 'percent' ? 'Phần trăm' : 'Cố định'
            } - ${discount.discountType === 'percent' ? discount.value + '%' : discount.value + 'đ'
            }`;

        // Cập nhật sách với note và discountId, trả về bản ghi đã cập nhật
        const updatedBook = await Book.findByIdAndUpdate(
            bookId,
            {
                note: note,
                discountId: discountId,
            },
            { new: true } // đảm bảo trả về bản ghi sau khi cập nhật
        );

        // Kiểm tra xem discountId đã được gán thành công chưa
        if (updatedBook && updatedBook.discountId && updatedBook.discountId.toString() === discountId) {
            console.log('Gán giảm giá thành công');
        } else {
            console.log('Gán giảm giá thất bại');
        }


        res.redirect('/admin/books');
    } catch (error) {
        console.error('Lỗi khi gán giảm giá:', error);
        res.status(500).send('Failed to assign discount');
    }
};
