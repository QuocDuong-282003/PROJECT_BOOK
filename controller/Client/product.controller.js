const Book = require("../../models/Book");


const getAllBooks = async () => {
    try {
        return await Book.find(); // Trả về danh sách sách từ DB
    } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
        return [];
    }
};

// Đảm bảo export đúng
module.exports = { getAllBooks };

exports.getProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const Product = await Book.findById(id);
        if (!Product) {
            res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        } else {
            res.json(Product);
        }
    } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        res.status(500).json({ message: "Lỗi server", error });
     }
}