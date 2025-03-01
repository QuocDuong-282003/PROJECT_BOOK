const Publisher = require("../../models/Publisher");

// 📌 Lấy danh sách tất cả nhà xuất bản
exports.getAllPublishers = async (req, res) => {
    try {
        const publishers = await Publisher.find();
        res.status(200).json({ publishers });
    } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách nhà xuất bản:", error);
        res.status(500).json({ message: "Lỗi server khi lấy danh sách nhà xuất bản", error: error.message });
    }
};

// 📌 Thêm nhà xuất bản mới
exports.createPublisher = async (req, res) => {
    try {
        const { name, address, phone, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: "Tên và email là bắt buộc!" });
        }

        const newPublisher = new Publisher({ name, address, phone, email });
        await newPublisher.save();

        res.status(201).json({ message: "Nhà xuất bản đã được thêm!", publisher: newPublisher });
    } catch (error) {
        console.error("❌ Lỗi khi thêm nhà xuất bản:", error);
        res.status(500).json({ message: "Lỗi server khi thêm nhà xuất bản", error: error.message });
    }
};

// 📌 Cập nhật thông tin nhà xuất bản
exports.updatePublisher = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, phone, email } = req.body;

        const updatedPublisher = await Publisher.findByIdAndUpdate(
            id,
            { name, address, phone, email },
            { new: true, runValidators: true }
        );

        if (!updatedPublisher) {
            return res.status(404).json({ message: "Không tìm thấy nhà xuất bản!" });
        }

        res.status(200).json({ message: "Cập nhật thành công!", publisher: updatedPublisher });
    } catch (error) {
        console.error("❌ Lỗi khi cập nhật nhà xuất bản:", error);
        res.status(500).json({ message: "Lỗi server khi cập nhật nhà xuất bản", error: error.message });
    }
};

// 📌 Xóa nhà xuất bản
exports.deletePublisher = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedPublisher = await Publisher.findByIdAndDelete(id);

        if (!deletedPublisher) {
            return res.status(404).json({ message: "Không tìm thấy nhà xuất bản!" });
        }

        res.status(200).json({ message: "Xóa thành công!", publisher: deletedPublisher });
    } catch (error) {
        console.error("❌ Lỗi khi xóa nhà xuất bản:", error);
        res.status(500).json({ message: "Lỗi server khi xóa nhà xuất bản", error: error.message });
    }
};
