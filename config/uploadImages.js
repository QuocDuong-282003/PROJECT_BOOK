const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Chỉ chấp nhận định dạng PNG, JPG hoặc JPEG"), false);
    }
};

const uploadImages = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter,
}).fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'Image', maxCount: 10 }  // <-- không dùng 'Image[]'
]);

module.exports = uploadImages;
