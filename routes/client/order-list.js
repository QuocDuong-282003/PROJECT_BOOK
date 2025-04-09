const express = require("express");
const router = express.Router();
const {getOrderByUserId} = require('../../controller/Client/order.controller');

router.get("/", async (req, res) => {
    try {    
        if (!req.session.user || !req.session.user.id) {
            return res.redirect('/'); 
        }
        const userID = req.session.user.id; 
        const orders = await getOrderByUserId(userID);
        res.render("client/order-list", { orders });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
        res.status(500).send("Lỗi máy chủ");
    }
});

module.exports = router;