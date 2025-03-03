const Order = require('../../models/Order');
const User = require('../../models/User');
const Discount = require('../../models/Discount');
const mongoose = require('mongoose');
const cron = require('node-cron');

// 🟢 Lấy danh sách đơn hàng
exports.getAllOrders = async (req, res) => {
    try {
        const orders = [
            { _id: "1", userId: "User A", totalAmount: 200, orderDate: new Date("2024-02-22"), status: "pending", paymentMethod: "Credit Card", address: "HCM" },
            { _id: "2", userId: "User B", totalAmount: 350, orderDate: new Date("2024-02-21"), status: "completed", paymentMethod: "PayPal", address: "HN" },
            { _id: "3", userId: "User C", totalAmount: 150, orderDate: new Date("2024-02-20"), status: "canceled", paymentMethod: "Bank Transfer", address: "HG" },
        ];
        //    const orders = await Order.find();
        // const orders = await Order.find().populate('userId').populate('discountId');  //dùng truy vấn data khi lấy từ dbdb
        res.render('orderAdmin', {
            title: 'Order', path: req.path, orders,

        });
    } catch (error) {
        res.status(500).send('Error when getting list of orders');
    }
};


