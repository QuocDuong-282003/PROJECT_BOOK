const Book = require("../../models/Book");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

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
const getProductByCategory = async (_idCategory) => {
    try {
        console.log("categoryId:", _idCategory);
        const categoryObjectId = new ObjectId(_idCategory);
        // Tìm tất cả sản phẩm có categoryId = _idCategory
        const product = await Book.find();
        const products = await Book.find({ categoryId: categoryObjectId });

        console.log("Số lượng sản phẩm:", products.length);
        console.log("Số lượng sản phẩm:", product.length);
        return products; // Trả về danh sách sản phẩm
    } catch (error) {
        console.error("Lỗi khi lấy sản phẩm theo danh mục:", error);
        return [];
    }
};


// Đảm bảo export đúng
module.exports = { getAllBooks, getProductById , getProductByCategory};