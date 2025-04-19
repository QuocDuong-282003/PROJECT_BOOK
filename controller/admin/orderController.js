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
        const { search, status } = req.query;

        let query = {};

        // Tìm theo trạng thái nếu có
        if (status) {
            query.status = status;
        }

        if (search) {
            // Tìm user có tên giống từ khóa
            const users = await User.find({
                name: { $regex: search, $options: 'i' }
            }).select('_id');

            const userIds = users.map(user => user._id);

            query.$or = [];

            // Nếu search là ObjectId hợp lệ thì thêm vào tìm theo _id
            if (mongoose.Types.ObjectId.isValid(search)) {
                query.$or.push({ _id: new mongoose.Types.ObjectId(search) });
            }

            // Nếu tìm thấy user thì thêm vào tìm theo userId
            if (userIds.length > 0) {
                query.$or.push({ userId: { $in: userIds } });
            }

            // Nếu $or rỗng thì bỏ để không lỗi
            if (query.$or.length === 0) delete query.$or;
        }

        const orders = await Order.find(query)
            .populate({ path: 'userId', select: 'name' })
            .populate('discountId')
            .exec();

        res.render('orderAdmin', {
            title: 'Order',
            path: req.path,
            orders
        });

    } catch (error) {
        console.error('Lỗi tìm kiếm đơn hàng:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi tìm kiếm đơn hàng' });
    }
};