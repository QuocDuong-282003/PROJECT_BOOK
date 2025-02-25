const Category = require('../../models/Category');

// 🔹 Lấy danh sách danh mục
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server: Không thể lấy danh mục." });
    }
};

// 🔹 Hiển thị trang thêm danh mục
exports.getAddCategoryPage = (req, res) => {
    res.render("admin/categories/add");
};

// 🔹 Thêm danh mục mới
exports.addCategory = async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.redirect("/admin/categories");
    } catch (error) {
        res.status(400).json({ message: "Lỗi: Không thể thêm danh mục." });
    }
};

// 🔹 Hiển thị trang chỉnh sửa danh mục
exports.getEditCategoryPage = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: "Danh mục không tồn tại." });
        res.render("admin/categories/edit", { category });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi lấy danh mục." });
    }
};

// 🔹 Chỉnh sửa danh mục
exports.editCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!category) return res.status(404).json({ message: "Danh mục không tồn tại." });
        res.redirect("/admin/categories");
    } catch (error) {
        res.status(400).json({ message: "Lỗi: Không thể chỉnh sửa danh mục." });
    }
};

// 🔹 Xóa danh mục (Xóa mềm)
exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.redirect("/admin/categories");
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi xóa danh mục." });
    }
};
