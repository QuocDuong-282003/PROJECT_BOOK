
const express = require('express');
const router = express.Router();
const { login, logout, checkAdmin } = require('../../controller/admin/auth.controller');

router.post('/login', login);
router.post('/logout', logout);
router.get('/check-admin', checkAdmin); // Kiểm tra Admin trực tiếp trong route
router.get('/', (req, res) => {
    res.send('Admin Auth API is working!');
});
router.get('/login', (req, res) => {
    res.render('admin/auth/login', { error: null });
});

module.exports = router;
