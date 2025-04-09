document.addEventListener("DOMContentLoaded", async function () {
    const dailyCtx = document.getElementById("dailyChart").getContext("2d");
    const monthlyCtx = document.getElementById("monthlyChart").getContext("2d");

    try {
        const response = await fetch("/admin/stats");
        const data = await response.json();

        if (!data || !Array.isArray(data)) {
            console.error("Dữ liệu API không hợp lệ:", data);
            return;
        }

        // Phân loại dữ liệu theo ngày và tháng
        const dailyStats = data.filter(stat => stat._id.length === 10); // Định dạng YYYY-MM-DD
        const monthlyStats = data.filter(stat => stat._id.length === 7); // Định dạng YYYY-MM

        // Tạo mảng labels và dữ liệu cho biểu đồ
        const dailyLabels = dailyStats.map(stat => stat._id);
        const dailyValues = dailyStats.map(stat => stat.totalOrders);

        const monthlyLabels = monthlyStats.map(stat => stat._id);
        const monthlyValues = monthlyStats.map(stat => stat.totalOrders);

        // Vẽ biểu đồ theo ngày
        new Chart(dailyCtx, {
            type: "bar",
            data: {
                labels: dailyLabels,
                datasets: [{
                    label: "Số lượng đơn hàng",
                    data: dailyValues,
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1
                }]
            }
        });

        // Vẽ biểu đồ theo tháng
        new Chart(monthlyCtx, {
            type: "line",
            data: {
                labels: monthlyLabels,
                datasets: [{
                    label: "Số lượng đơn hàng",
                    data: monthlyValues,
                    backgroundColor: "rgba(255, 99, 132, 0.6)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 2
                }]
            }
        });

    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
    }
});
