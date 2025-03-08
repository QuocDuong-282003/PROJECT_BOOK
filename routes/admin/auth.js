const express = require('express');
const router = express.Router();
const adminAuthController = require('../../controller/admin/auth.controller');

router.get('/login', adminAuthController.renderLogin);
router.post('/login', adminAuthController.login);
router.get('/logout', adminAuthController.logout);

module.exports = router;
