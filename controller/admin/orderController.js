const Order = require('../../models/Order');
const User = require('../../models/User');
const Discount = require('../../models/Discount');
const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;
const cron = require('node-cron');

// exports.getAllOrders = async (req, res) => {
//     try {
//         const orders = await Order.find();
//         console.log(orders);  // Kiểm tra dữ liệu trước khi populate

//         const populatedOrders = await Order.find()
//             .populate('userId', 'name')  // Chỉ lấy tên từ bảng User
//             .populate('discountId');

//         console.log(populatedOrders);  // Kiểm tra dữ liệu sau khi populate

//         res.render('orderAdmin', {
//             title: 'Order',
//             path: req.path,
//             orders: populatedOrders
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error when getting list of orders');
//     }
// };

// exports.getAllOrders = async (req, res) => {
//     try {
//         // Lấy tất cả đơn hàng
//         let orders = await Order.find();

//         console.log('Orders before conversion:', orders);

//         // Chuyển đổi userId từ string sang ObjectId nếu cần
//         orders = orders.map(order => {
//             if (order.userId && typeof order.userId === 'string') {
//                 order.userId = convertToObjectId(order.userId);
//             }
//             return order;
//         });

//         // Cập nhật lại trong database nếu cần thiết (tuỳ chọn)
//         await Promise.all(orders.map(order => Order.updateOne({ _id: order._id }, { userId: order.userId })));

//         // Truy vấn lại với populate để lấy `name` từ `User`
//         const populatedOrders = await Order.find()
//             .populate({
//                 path: 'userId',
//                 select: 'name'
//             })
//             .populate('discountId'); // Populate thêm discountId nếu cần
//         console.log('Orders after population:', populatedOrders);
//         // Render trang orderAdmin và truyền dữ liệu vào view
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
// controllers/orderController.js
// exports.getAllOrders = async (req, res) => {
//     try {
//         // Lấy tất cả các đơn hàng
//         const orders = await Order.find();

//         // Lặp qua các đơn hàng để thêm tên người dùng
//         for (let order of orders) {
//             // Tìm người dùng từ bảng User dựa trên userId
//             const user = await User.findOne({ _id: order.userId });

//             // Nếu tìm thấy người dùng, thêm tên vào mỗi đơn hàng
//             if (user) {
//                 order.userName = user.name;
//             } else {
//                 order.userName = 'Unknown User'; // Nếu không có người dùng
//             }
//         }

//         // Render ra view với các đơn hàng và tên người dùng
//         res.render('orderAdmin', {
//             title: 'Orders',
//             path: req.path,
//             orders
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error when getting list of orders');
//     }
// };
exports.getAllOrders = async (req, res) => {
    try {

        let orders = await Order.find();

        // Kiểm tra nếu userId là string thì chuyển về ObjectId
        orders = orders.map(order => {
            if (order.userId && typeof order.userId === 'string') {
                order.userId = new mongoose.Types.ObjectId(order.userId);
            }
            return order;
        });

        // Truy vấn lại với populate
        const populatedOrders = await Order.find()
            .populate({
                path: 'userId',
                select: 'name email', // Chỉ lấy name và email của User
                model: 'User'
            })
            .populate('discountId'); // Lấy thông tin giảm giá nếu có

        console.log('Orders after population:', populatedOrders);

        // Render trang orderAdmin
        res.render('orderAdmin', {
            title: 'Order',
            path: req.path,
            orders: populatedOrders
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error when getting list of orders');
    }
};
