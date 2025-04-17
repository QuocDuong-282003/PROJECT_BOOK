const Order = require("../../models/Order");

// exports.renderOrderStats = async (req, res) => {
//     try {
//         // Thống kê theo ngày
//         const dailyStats = await Order.aggregate([
//             {
//                 $group: {
//                     _id: { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } },
//                     totalOrders: { $sum: 1 }
//                 }
//             },
//             { $sort: { _id: 1 } }
//         ]);

//         // Thống kê theo tháng
//         const monthlyStats = await Order.aggregate([
//             {
//                 $group: {
//                     _id: { $dateToString: { format: "%Y-%m", date: "$orderDate" } },
//                     totalOrders: { $sum: 1 }
//                 }
//             },
//             { $sort: { _id: 1 } }
//         ]);

//         res.render("admin/chart", {
//             title: "Thống kê đơn hàng",
//             path: "chart",
//             dailyChartData: {
//                 labels: dailyStats.map(stat => stat._id),
//                 data: dailyStats.map(stat => stat.totalOrders),
//                 label: "Số lượng đơn hàng theo ngày"
//             },
//             monthlyChartData: {
//                 labels: monthlyStats.map(stat => stat._id),
//                 data: monthlyStats.map(stat => stat.totalOrders),
//                 label: "Số lượng đơn hàng theo tháng"
//             }
//         });
//     } catch (err) {
//         console.error("Lỗi khi render biểu đồ:", err);
//         res.status(500).send("Lỗi khi hiển thị biểu đồ");
//     }

// };
// controller/chartController.js
exports.renderOrderStats = async (req, res) => {
    try {
        // Lấy thống kê đơn hàng theo ngày
        const dailyStats = await Order.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } },
                    totalOrders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Lấy thống kê đơn hàng theo tháng
        const monthlyStats = await Order.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$orderDate" } },
                    totalOrders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Truyền dữ liệu vào view chart.ejs
        res.render('admin/chart', {
            title: 'Thống kê đơn hàng',
            path: 'chart',
            dailyLabels: JSON.stringify(dailyStats.map(item => item._id)),
            dailyValues: JSON.stringify(dailyStats.map(item => item.totalOrders)),
            monthlyLabels: JSON.stringify(monthlyStats.map(item => item._id)),
            monthlyValues: JSON.stringify(monthlyStats.map(item => item.totalOrders))
        });

    } catch (err) {
        console.error("Lỗi khi render biểu đồ:", err);
        res.status(500).send("Lỗi khi hiển thị biểu đồ");
    }
};

/**
 * Lấy thống kê đơn hàng theo ngày
 */
exports.getDailyStats = async (req, res) => {
    try {
        const dailyStats = await Order.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } }, // Không còn lỗi kiểu dữ liệu
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: "$totalAmount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        if (!dailyStats.length) {
            return res.status(404).json({ message: "Không có dữ liệu thống kê." });
        }
        res.render('admin/chart', {
            title: 'Thống kê đơn hàng',
            path: 'chart',
            dailyLabels: JSON.stringify(dailyStats.map(item => item._id)),
            dailyValues: JSON.stringify(dailyStats.map(item => item.totalOrders)),
            monthlyLabels: JSON.stringify(monthlyStats.map(item => item._id)),
            monthlyValues: JSON.stringify(monthlyStats.map(item => item.totalOrders))
        });
        //res.json(dailyStats);
    } catch (error) {
        console.error(" Lỗi lấy thống kê theo ngày:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

/**
 * Lấy thống kê đơn hàng theo tháng
 */
exports.getMonthlyStats = async (req, res) => {
    try {
        const monthlyStats = await Order.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$orderDate" } }, // Không còn lỗi kiểu dữ liệu
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: "$totalAmount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        if (!monthlyStats.length) {
            return res.status(404).json({ message: "Không có dữ liệu thống kê." });
        }
        res.render('admin/chart', {
            title: 'Thống kê đơn hàng',
            path: 'chart',
            dailyLabels: JSON.stringify(dailyStats.map(item => item._id)),
            dailyValues: JSON.stringify(dailyStats.map(item => item.totalOrders)),
            monthlyLabels: JSON.stringify(monthlyStats.map(item => item._id)),
            monthlyValues: JSON.stringify(monthlyStats.map(item => item.totalOrders))
        });
        // res.json(monthlyStats);
    } catch (error) {
        console.error(" Lỗi lấy thống kê theo tháng:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
