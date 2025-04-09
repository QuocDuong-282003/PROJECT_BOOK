const Order = require('../../models/Order');
const getOrderByUserId = async (userID) => {
    try {
        const orders = await Order.find({ userId: userID }).sort({ orderDate: -1 });
        return orders;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
        return null;
        
    }
};
const addOrder = async (orderId,userId,firstName,lastName, address,ward,district,city,totalAmount,orderDate,status,paymentMethod,items) => {
    try {
        const order =await Order.create({
            orderId,
            userId,
            firstName,
            lastName,
            address,
            ward,
            district,
            city,
            totalAmount,
            orderDate,
            status,
            paymentMethod,
            items
        });
        return order;
    } catch (error) {
        console.error("Lỗi khi thêm đơn hàng:", error);
        return null;
    }
};
const updateStatus = async (orderID, newStatus) => {
    try {
        const statusUpdate = await Order.findOneAndUpdate({orderId:orderID}, { status:newStatus }, { new: true });
        return statusUpdate;
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
        return null;
    }
};
module.exports = {getOrderByUserId,addOrder,updateStatus};