const Category = require("../../models/Category");
const Book = require("../../models/Book");


// Hiển thị danh sách danh mục với phân trang

exports.getCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là 1
        const limit = 10; // Số danh mục hiển thị trên mỗi trang
        const skip = (page - 1) * limit; // Vị trí bắt đầu lấy dữ liệu

        // Lấy danh sách danh mục với phân trang
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
            { $skip: skip }, // Bỏ qua các bản ghi trước đó
            { $limit: limit }, // Giới hạn số bản ghi trên mỗi trang
        ]);

        // Đếm tổng số danh mục để tính tổng số trang
        const totalCategories = await Category.countDocuments();
        const totalPages = Math.ceil(totalCategories / limit); // Tổng số trang

        // Render view và truyền các biến cần thiết
        res.render("admin/category/categoriesAdmin", {
            categories,
            totalCategories,
            totalPages, // Truyền biến totalPages vào view
            currentPage: page, // Truyền biến currentPage vào view
            path: "categories",
            title: "Quản lý Danh mục",
        });
    } catch (err) {
        res.status(500).send("Lỗi server khi lấy danh sách danh mục.");
    }
};

// Tìm kiếm danh mục
exports.searchCategories = async (req, res) => {
    try {
        const query = req.query.query; // Lấy từ khóa tìm kiếm từ query string
        const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là 1
        const limit = 10; // Số danh mục hiển thị trên mỗi trang
        const skip = (page - 1) * limit; // Vị trí bắt đầu lấy dữ liệu

        // Tìm kiếm danh mục
        const categories = await Category.aggregate([
            {
                $match: {
                    $or: [
                        { name: { $regex: query, $options: "i" } }, // Tìm kiếm theo tên (không phân biệt hoa thường)
                        { description: { $regex: query, $options: "i" } }, // Tìm kiếm theo mô tả
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
                    bookCount: { $size: "$books" }, // Đếm số sách thuộc mỗi danh mục
                },
            },
            { $skip: skip }, // Bỏ qua các bản ghi trước đó
            { $limit: limit }, // Giới hạn số bản ghi trên mỗi trang
        ]);

        // Đếm tổng số danh mục phù hợp với từ khóa tìm kiếm
        const totalCategories = await Category.countDocuments({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
            ],
        });
        const totalPages = Math.ceil(totalCategories / limit); // Tổng số trang

        // Render view và truyền các biến cần thiết
        res.render("admin/category/categoriesAdmin", {
            categories,
            totalCategories,
            totalPages, // Truyền biến totalPages vào view
            currentPage: page, // Truyền biến currentPage vào view
            path: "categories",
            title: "Kết quả tìm kiếm",
            query, // Truyền từ khóa tìm kiếm vào view
        });
    } catch (err) {
        res.status(500).send("Lỗi server khi tìm kiếm danh mục.");
    }
};
// Thêm danh mục mới
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newCategory = new Category({ name, description });
        await newCategory.save();
        res.redirect("/admin/category");
    } catch (err) {
        res.status(500).send("Lỗi server khi thêm danh mục.");
    }
};

// Cập nhật danh mục
exports.updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const categoryId = req.params.id;
        await Category.findByIdAndUpdate(categoryId, { name, description });
        res.redirect("/admin/category");
    } catch (err) {
        res.status(500).send("Lỗi server khi cập nhật danh mục.");
    }
};

// Xóa danh mục
exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        await Category.findByIdAndDelete(categoryId);
        res.redirect("/admin/category");
    } catch (err) {
        res.status(500).send("Lỗi server khi xóa danh mục.");
    }
};