var express = require('express');
var auth = express.Router();
var AuthController = require('../controllers/AuthController')
/* GET users listing. */
auth.get('/', AuthController.get);
auth.get('/login', AuthController.login);
auth.get('/callback', AuthController.getCallBack);
auth.get('/refresh_token', AuthController.refreshToken);
module.exports = auth;
