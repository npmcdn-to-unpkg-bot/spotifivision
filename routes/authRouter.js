var express = require('express');
var router = express.Router();
var AuthController = require('../controllers/AuthController');
/* GET users listing. */
router.get('/', AuthController.get);
router.get('/login', AuthController.login);
router.get('/callback', AuthController.getCallBack);
router.get('/refresh_token', AuthController.refreshToken);
module.exports = router;
