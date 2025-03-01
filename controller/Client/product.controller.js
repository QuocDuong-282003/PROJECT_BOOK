const Book = require("../../models/Book");

const getAllBooks = async () => {
    try {
        return await Book.find(); // Trả về danh sách sách từ DB
    } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
        return [];
    }
};

const getProductById = async (_id) => {
    try {
        const Product = await Book.findById(_id);
        if (!Product) {
            res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        } else {
            return Product;
        }
    } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        res.status(500).json({ message: "Lỗi server", error });
     }
}

// Lấy sản phẩm theo danh mục
const getProductByCategory = async (_idCategory) => {
    try {
        console.log("categoryId:", _idCategory);
        const products = await Book.find({ categoryId: _idCategory });
        return products; 
    } catch (error) {
        console.error("Lỗi khi lấy sản phẩm theo danh mục:", error);
        return [];
    }
};


// Đảm bảo export đúng
module.exports = { getAllBooks, getProductById , getProductByCategory};