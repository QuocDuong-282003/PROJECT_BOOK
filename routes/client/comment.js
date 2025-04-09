const express = require('express');
const router = express.Router();

const { getCMTByBookId, addCMT } = require('../../controller/Client/comment.controller');
const { getProductById } = require('../../controller/Client/product.controller');


router.post('/add', async (req, res) => {
    try {
        const { bookId, userId, content,rating } = req.body;
        const newCmt = await addCMT(bookId, userId, content,rating);
        if (!newCmt) {
            return res.status(500).json({ message: "Lỗi khi thêm bình luận" });
        }
        return res.status(200).json({ message: "Thêm bình luận thành công", cmt: newCmt });
    } catch (error) {
        console.error("Lỗi khi thêm bình luận:", error);
        return res.status(500).json({ message: "Lỗi server" });
    }
});

module.exports = router;