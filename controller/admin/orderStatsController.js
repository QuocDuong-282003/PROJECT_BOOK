const Order = require("../../models/Order");

/**
 * Hiển thị trang thống kê đơn hàng
 */
exports.renderOrderStats = (req, res) => {
    res.render("admin/chart", {
        title: "Thống kê đơn hàng",
        path: "chart",
        chartData: {
            labels: [],
            data: [],
            label: "Số lượng đơn hàng"
        }
    });
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

        res.json(dailyStats);
    } catch (error) {
        console.error("❌ Lỗi lấy thống kê theo ngày:", error);
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

        res.json(monthlyStats);
    } catch (error) {
        console.error("❌ Lỗi lấy thống kê theo tháng:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
