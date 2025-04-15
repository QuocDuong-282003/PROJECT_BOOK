
const Book = require("../../models/Book");

const applyDiscountInfoToBooks = (books) => {
    return books.map(book => {
        const bookObj = book.toObject(); // Chuyển sang object để gán giá trị mới
        if (bookObj.note && bookObj.note.includes("Mã:")) {
            const match = bookObj.note.match(/Mã:.*?(?:Phần trăm|Cố định) - ([\d.]+)(%|đ)/);
            if (match) {
                const value = parseFloat(match[1]);
                const type = match[2];
                bookObj.hasDiscount = true;
                bookObj.originalPrice = bookObj.price;

                if (type === '%') {
                    bookObj.discountedPrice = Math.floor(bookObj.price * (1 - value / 100));
                } else {
                    bookObj.discountedPrice = Math.floor(bookObj.price - value);
                }
            }
        }
        return bookObj;
    });
};

const getAllBooks = async () => {
    try {
        const books = await Book.find().populate("categoryId", "name").populate("publisherId", "name");
        return applyDiscountInfoToBooks(books);
    } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
        return [];
    }
};

const getProductById = async (bookId) => {
    try {
        return await Book.findById(bookId).populate("categoryId", "name").populate("publisherId", "name");;
    } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        return null;
    }
};


// Lấy sản phẩm theo danh mục
const getProductByCategory = async (_idCategory) => {
    try {
        const products = await Book.find({ categoryId: _idCategory });
        return products;
    } catch (error) {
        console.error("Lỗi khi lấy sản phẩm theo danh mục:", error);
        return [];
    }
};


// Đảm bảo export đúng
module.exports = { getAllBooks, getProductById, getProductByCategory, applyDiscountInfoToBooks };
