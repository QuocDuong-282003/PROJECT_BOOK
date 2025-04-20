const mongoose = require('mongoose');
const Order = require('../../models/Order');
const User = require('../../models/User'); // Import model User

// Hàm lấy tất cả đơn hàng
// exports.getAllOrders = async (req, res) => {
//     try {
//         // Lấy tất cả đơn hàng
//         let orders = await Order.find();

//         console.log('Orders before conversion:', orders);

//         // Kiểm tra và ép kiểu `userId` nếu cần
//         orders = orders.map(order => {
//             if (order.userId && !(order.userId instanceof mongoose.Types.ObjectId)) {
//                 order.userId = new mongoose.Types.ObjectId(order.userId);
//             }
//             return order;
//         });
//         // Cập nhật lại nếu `userId` bị sai kiểu (Không bắt buộc)
//         await Promise.all(orders.map(order =>
//             Order.updateOne({ _id: order._id }, { userId: order.userId })
//         ));

//         // Truy vấn lại và populate userId
//         const populatedOrders = await Order.find()
//             .populate({ path: 'userId', select: 'name' }) // Populate lấy 'name' từ User
//             .populate('discountId') // Populate giảm giá nếu có
//             .exec();

//         console.log('Orders after population:', populatedOrders);

//         // Render trang orderAdmin
//         res.render('orderAdmin', {
//             title: 'Order',
//             path: req.path,
//             orders: populatedOrders
//         });

//     } catch (error) {
//         console.error('Error fetching orders:', error);
//         res.status(500).send('Error when getting list of orders');
//     }
// };
exports.getAllOrders = async (req, res) => {
    try {
        // Kiểm tra xem có đơn hàng nào có `userId` không
        const orders = await Order.find().populate({
            path: 'userId',
            select: 'name ' // Lấy thêm email & phone nếu cần
        });
        // console.log('Populated Orders:', orders);
        if (!orders || orders.length === 0) {
            return res.status(404).send('Không có đơn hàng nào.');
        }
        res.render('orderAdmin', {
            title: 'Order',
            path: req.path,
            orders
        });

    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Error khi lấy danh sách đơn hàng');
    }
};
exports.searchOrders = async (req, res) => {
    try {
        const searchQuery = req.query.search || '';
        let orders = [];

        if (searchQuery) {
            // Tìm tất cả users có tên khớp với query
            const users = await User.find({
                name: { $regex: searchQuery, $options: 'i' }
            });

            // Lấy danh sách userId từ kết quả trên
            const userIds = users.map(user => user._id);

            // Tìm đơn hàng theo orderId hoặc userId nằm trong danh sách
            orders = await Order.find({
                $or: [
                    { orderId: { $regex: searchQuery, $options: 'i' } },
                    { userId: { $in: userIds } }
                ]
            }).populate('userId', 'name');
        } else {
            orders = await Order.find().populate('userId', 'name');
        }

        res.render('orderAdmin', {
            title: 'Order',
            path: req.path,
            orders,
            searchQuery
        });
    } catch (error) {
        console.error('Lỗi tìm kiếm đơn hàng:', error);
        res.status(500).send('Lỗi khi tìm kiếm đơn hàng');
    }
};
