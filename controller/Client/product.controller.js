const Book = require("../../models/Book");


const getAllBooks = async () => {
    try {
        return await Book.find(); // Trả về danh sách sách từ DB
    } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
        return [];
    }
};

const getProductById = async (req, res,_id) => {
    try {
        const _id = req.params.id;
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
const getProductByCategory = async (categoryId) => {
    try {
        return await Book.find({ categoryId }); // Tìm theo `categoryId`
    } catch (error) {
        console.error("Lỗi khi lấy sản phẩm theo danh mục:", error);
        return [];
    }
};

// Đảm bảo export đúng
module.exports = { getAllBooks, getProductById , getProductByCategory};