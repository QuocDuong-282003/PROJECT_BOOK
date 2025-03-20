const Order = require('../../models/Order');

const addOrder = async (orderId,userId,firstName,lastName, address,ward,district,city,totalAmount,orderDate,status,paymentMethod) => {
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
            paymentMethod
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
module.exports = {addOrder,updateStatus};