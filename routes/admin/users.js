const express = require('express');
const router = express.Router();
const userController = require('../../controller/admin/users.controller');

// Route để thêm người dùng
router.post('/add', userController.addUser);

// Route để cập nhật người dùng
router.post('/:id/update', userController.updateUser);

// Route để xóa người dùng
router.post('/:id/delete', userController.deleteUser);

// Route để reset mật khẩu
router.post('/:id/reset-password', userController.resetPassword);

// Route để lấy danh sách người dùng
router.get('/', userController.getAllUsers);

//tìm kiếm người dùng
router.get('/search', userController.searchUsers);

// Route để lấy đơn hàng của người dùng
router.get('/:id/orders', userController.getUserOrders);

module.exports = router;
