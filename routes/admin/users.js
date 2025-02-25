const express = require("express");
const {
    getUsers,
    updateUser,
    toggleUserBlock,
    getUserStatistics
} = require("../../controller/admin/users.controller");

const router = express.Router();

router.get("/", getUsers); // 🟢 Lấy danh sách người dùng
router.put("/:id", updateUser); // 🟢 Cập nhật thông tin người dùng
router.patch("/block/:id", toggleUserBlock); // 🔴 Khóa/Mở khóa tài khoản
router.get("/statistics", getUserStatistics); // 📊 Thống kê hoạt động

module.exports = router;
