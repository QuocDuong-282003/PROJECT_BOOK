// Middleware bắt lỗi multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Nếu file quá lớn, sẽ thông báo lỗi này
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).send('Kích thước file quá lớn. Tối đa 5MB.');
        }
        return res.status(400).send(`Lỗi khi tải file: ${err.message}`);
    }
    // Kiểm tra nếu có lỗi do file không hợp lệ
    if (err) {
        return res.status(400).send(err.message);
    }
    next();
};

module.exports = handleMulterError;
