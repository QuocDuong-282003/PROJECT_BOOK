const Category = require("../../models/Category");
const Book = require("../../models/Book");

// Hiển thị danh sách danh mục với thống kê số sách
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.aggregate([
            {
                $lookup: {
                    from: "books", // Tên collection Book
                    localField: "_id",
                    foreignField: "categoryId",
                    as: "books",
                },
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    bookCount: { $size: "$books" }, // Đếm số sách thuộc mỗi danh mục
                },
            },
        ]);
        res.render("admin/category/category", {
            categories,
            totalCategories: categories.length,
            path: "categories",
            title: "Quản lý Danh mục",
            currentPage: 1,
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server khi lấy danh sách danh mục." });
    }
};

// Tìm kiếm danh mục
exports.searchCategories = async (req, res) => {
    try {
        const searchQuery = req.query.q; // Lấy từ khóa tìm kiếm từ query string
        const categories = await Category.aggregate([
            {
                $match: {
                    $or: [
                        { name: { $regex: searchQuery, $options: "i" } }, // Tìm kiếm theo tên (không phân biệt hoa thường)
                        { description: { $regex: searchQuery, $options: "i" } }, // Tìm kiếm theo mô tả
                    ],
                },
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "categoryId",
                    as: "books",
                },
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    bookCount: { $size: "$books" },
                },
            },
        ]);
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server khi tìm kiếm danh mục.", error: err.message });
    }
};

// Thêm danh mục mới
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Tên danh mục là bắt buộc." });
        }
        const newCategory = new Category({ name, description });
        await newCategory.save();
        res.status(201).json({ success: true, message: "Thêm danh mục thành công!" });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server khi thêm danh mục.", error: err.message });
    }
};

// Chỉnh sửa danh mục
exports.updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const categoryId = req.params.id;
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { name, description },
            { new: true }
        );
        if (!updatedCategory) {
            return res.status(404).json({ message: "Không tìm thấy danh mục." });
        }
        res.status(200).json({ success: true, message: "Cập nhật danh mục thành công!" });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server khi cập nhật danh mục." });
    }
};

// Xóa danh mục
exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const deletedCategory = await Category.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Không tìm thấy danh mục." });
        }
        res.status(200).json({ success: true, message: "Xóa danh mục thành công!" });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server khi xóa danh mục." });
    }
};