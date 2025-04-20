const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongoose').Types;  // Import ObjectId từ mongoose

const { getCMTByBookId, addCMT } = require('../../controller/Client/comment.controller');
const { getProductById, updateRating } = require('../../controller/Client/product.controller');
const { updateFeedback } = require('../../controller/Client/order.controller');

router.post('/add', async (req, res) => {
    try {
        // Lấy dữ liệu từ body request
        const { bookId: bookIds, userId, content, rating, orderId } = req.body;

        // Kiểm tra dữ liệu có thiếu hay không
        if (!bookIds || !userId || !content || !rating) {
            return res.status(400).json({ message: "Thiếu thông tin" });
        }
        console.log("bookIds nhận được từ client:", bookIds);
        // Kiểm tra bookIds có phải là một mảng không và mỗi phần tử là ObjectId hợp lệ
        if (!Array.isArray(bookIds) || !bookIds.every(id => ObjectId.isValid(id))) {
            return res.status(400).json({ message: "bookId không hợp lệ" });
        }

        // Kiểm tra userId có phải ObjectId hợp lệ không
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "userId không hợp lệ" });
        }

        // Khởi tạo mảng kết quả để lưu thông tin phản hồi
        const results = [];

        // Cập nhật feedback từ orderId
        const feedback = await updateFeedback(orderId);

        // Duyệt qua từng bookId để thêm bình luận và cập nhật rating
        for (const bookId of bookIds) {
            const bookObjectId = ObjectId(bookId);  // Chuyển bookId thành ObjectId
            const userObjectId = ObjectId(userId);  // Chuyển userId thành ObjectId

            // Thêm bình luận mới
            const newCmt = await addCMT(bookObjectId, userObjectId, content, rating);

            // Cập nhật rating cho sách
            const rate = await updateRating(bookObjectId, rating);

            // Đưa thông tin vào kết quả
            results.push({ bookId: bookObjectId, cmt: newCmt, rate, feedback });
        }

        // Trả về kết quả sau khi đã xử lý
        return res.redirect('/orderlist');  // Redirect sau khi hoàn thành (có thể đổi thành json nếu cần trả kết quả JSON)

    } catch (error) {
        console.error("Lỗi khi thêm bình luận:", error);
        return res.status(500).json({ message: "Lỗi server" });
    }
});

module.exports = router;
