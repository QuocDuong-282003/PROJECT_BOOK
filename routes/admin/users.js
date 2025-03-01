const express = require('express');
const router = express.Router();
const userController = require('../../controller/admin/users.controller');

// 🛠️ Định nghĩa các route
router.get('/', userController.getAllUsers); // Lấy danh sách người dùng
router.get('/stats', userController.getUserStatistics); // Thống kê hoạt động người dùng
router.get('/:id', userController.getUserById); // Lấy thông tin 1 người dùng
router.put('/:id', userController.updateUser); // Cập nhật thông tin người dùng
router.patch('/:id/toggle-status', userController.toggleUserStatus); // Khóa/Mở khóa tài khoản khách hàng

module.exports = router;
