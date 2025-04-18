const express = require('express');
const router = express.Router();

const { getCMTByBookId, addCMT } = require('../../controller/Client/comment.controller');
const { getProductById, updateRating } = require('../../controller/Client/product.controller');
const { updateFeedback } = require('../../controller/Client/order.controller');

router.post('/add', async (req, res) => {
    try {
        const bookIds = req.body.bookId; // Đây là mảng
        const userId = req.body.userId;
        const content = req.body.content;
        const rating = req.body.rating;

        if (!bookIds || !userId || !content || !rating) {
            return res.status(400).json({ message: "Thiếu thông tin" });
        }

        const results = [];

        for (const bookId of bookIds) {
            const newCmt = await addCMT(bookId, userId, content, rating);
            const rate = await updateRating(bookId, rating);
            const feedback = await updateFeedback(bookId, true);
            results.push({ bookId, cmt: newCmt, rate ,feedback});
        }
        return res.redirect('/orderlist');

    } catch (error) {
        console.error("Lỗi khi thêm bình luận:", error);
        return res.status(500).json({ message: "Lỗi server" });
    }
});

module.exports = router;