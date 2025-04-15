const multer = require("multer");
const path = require("path");

// Sử dụng bộ nhớ (memoryStorage) để lưu ảnh vào bộ nhớ RAM
const storage = multer.memoryStorage();

// Bộ lọc file hợp lệ
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Chỉ chấp nhận định dạng PNG, JPG, hoặc JPEG"), false);
    }
};

// Tạo middleware upload
const uploadImages = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB mỗi ảnh
    },
    fileFilter: fileFilter,
}).single('coverImage'); // Chỉ cho phép upload 1 ảnh

module.exports = uploadImages;
