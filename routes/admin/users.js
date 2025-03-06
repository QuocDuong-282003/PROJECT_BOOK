const express = require('express');
const router = express.Router();
const userController = require('../../controller/admin/users.controller');

// 🛠️ Định nghĩa các route
router.get('/', userController.getAllUsers);

router.post('/add', userController.addUser);
router.get('/search', userController.searchUsers);
router.get('/stats', userController.getUserStatistics);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);

router.patch('/:id/toggle-status', userController.toggleUserStatus);
router.delete('/:id', userController.deleteUser);
router.patch('/:id/reset-password', userController.resetPassword);
router.patch('/:id/update-role', userController.updateUserRole);
router.get('/:id/orders', userController.getUserOrders);

module.exports = router;