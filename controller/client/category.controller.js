const Category = require("../../models/Category");

const getAllCategories = async () => {
    try {
        return await Category.find();
    } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
        return [];
    }
};

module.exports= {getAllCategories};