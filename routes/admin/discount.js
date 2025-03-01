const express = require('express');
const router = express.Router();
const discountController = require('../../controller/admin/discount.controller');

// 🛠️ Định nghĩa các route
router.get('/', discountController.getAllDiscounts);
router.get('/:id', discountController.getDiscountById);
router.post('/', discountController.createDiscount);
router.put('/:id', discountController.updateDiscount);
router.delete('/:id', discountController.deleteDiscount);

module.exports = router;
