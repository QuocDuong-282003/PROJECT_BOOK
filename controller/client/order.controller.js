const Order = require('../../models/Order');
const Book = require('../../models/Book');
const getOrderByUserId = async (userID) => {
    try {
        const orders = await Order.find({ userId: userID }).populate("items.bookId").sort({ orderDate: -1 });
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
const updateBook = async (items) => {
    try {
        if (!Array.isArray(items)) {
            console.error("Dữ liệu không phải là một danh sách:", items);
            return null;
        }

        const updatedBooks = [];

        for (const item of items) {
            const { bookId, quantity } = item;
            console.log(`Cập nhật sách ${bookId} với số lượng ${quantity}`);

            const book = await Book.findById(bookId);

            if (book) {
                book.stock = Math.max(book.stock - quantity, 0);
                book.selling += quantity;
                await book.save();
                updatedBooks.push(book);
            } else {
                console.warn("Không tìm thấy sách:", bookId);
            }
        }

        return updatedBooks;

    } catch (error) {
        console.error("Lỗi khi cập nhật danh sách sản phẩm:", error);
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
module.exports = {getOrderByUserId,addOrder,updateStatus, updateBook};