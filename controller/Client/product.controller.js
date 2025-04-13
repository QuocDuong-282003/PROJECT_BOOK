const Book = require("../../models/Book");

const getAllBooks = async () => {
    try {
        return await Book.find(); // Trả về danh sách sách từ DB
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

const findProductByName = async (name) => {
    try {
        const products = await Book.find({ title: { $regex: name, $options: "i" } });
        return products; 
    } catch (error) {
        console.error("Lỗi khi tìm sản phẩm theo tên:", error);
        return [];
    }
};

// Đảm bảo export đúng
module.exports = { getAllBooks, getProductById , getProductByCategory, findProductByName};