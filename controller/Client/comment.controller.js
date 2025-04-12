const cmt = require('../../models/Comment');

const getCMTByBookId = async (bookId) => {
    try {
        const cmtList = await cmt.find({ book: bookId }).populate('user');
        return cmtList;
    } catch (error) {
        console.error("Lỗi khi lấy bình luận:", error);
        return [];
    }
}
const addCMT = async (bookId, userId, content, rating) => {
    try {
        const newCmt = new cmt({
            book: bookId,
            user: userId,
            rating: rating,
            content: content
        });
        await newCmt.save();
        return newCmt;
    } catch (error) {
        console.error("Lỗi khi thêm bình luận:", error);
        return null;
    }
}
module.exports = { getCMTByBookId, addCMT };