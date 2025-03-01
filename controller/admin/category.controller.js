// controllers/category.controller.js
const Category = require("../../models/Category");

// 📌 Hiển thị danh sách danh mục
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server khi lấy danh sách danh mục." });
    }
};

// 📌 Thêm danh mục mới
exports.createCategory = async (req, res) => {
    try {
        console.log("Dữ liệu nhận được:", req.body); // Kiểm tra dữ liệu gửi lên
        const { name, description } = req.body;
        
        if (!name) {
            return res.status(400).json({ message: "Tên danh mục là bắt buộc." });
        }

        const newCategory = new Category({ name, description });
        await newCategory.save();

        res.status(201).json(newCategory);
    } catch (err) {
        console.error("Lỗi khi thêm danh mục:", err); // In lỗi ra terminal
        res.status(500).json({ message: "Lỗi server khi thêm danh mục.", error: err.message });
    }
};

// 📌 Chỉnh sửa danh mục
exports.updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, { name, description }, { new: true });
        res.status(200).json(updatedCategory);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server khi cập nhật danh mục." });
    }
};

// 📌 Xóa danh mục
exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Danh mục đã được xóa." });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server khi xóa danh mục." });
    }
};

// 📌 Xem thống kê số lượng sách trong mỗi danh mục
exports.getCategoryStatistics = async (req, res) => {
    try {
        const statistics = await Category.aggregate([
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "categoryId",
                    as: "books"
                }
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    bookCount: { $size: "$books" }
                }
            }
        ]);
        res.status(200).json(statistics);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server khi lấy thống kê danh mục." });
    }
};
