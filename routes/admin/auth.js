const express = require('express');
const router = express.Router();
const adminAuthController = require('../../controller/admin/auth.controller');

router.get('/login', adminAuthController.renderLogin);

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });
router.post('/checklogin', adminAuthController.login);
router.get('/logout', adminAuthController.logout);

module.exports = router;
