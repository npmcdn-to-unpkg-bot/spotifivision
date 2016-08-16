var express = require('express');
var router = express.Router();

var VisionController = require('../controllers/VisionController');
var AuthController = require('../controllers/AuthController');

/* GET home page. */

// CRUD routes
router.get('/test/:id', VisionController.get);
router.get('/test/', VisionController.index);
router.post('/test/', VisionController.create);
router.put('/test/:id', VisionController.update);
router.delete('/test/:id', VisionController.destroy);

// Spotify routes
router.get('/login', AuthController.login);
router.get('/callback', AuthController.getCallback);
router.get('/refresh_token', AuthController.refreshToken);


module.exports = router;
