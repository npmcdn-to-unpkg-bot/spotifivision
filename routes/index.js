var express = require('express');
var router = express.Router();

var VisionController = require('../controllers/VisionController');
// var AuthController = require('../controllers/AuthController');

/* GET home page. */

// CRUD routes
router.get('/:id', VisionController.get);
router.get('/', VisionController.index);
router.post('/', VisionController.create);
router.put('/:id', VisionController.update);
router.delete('/:id', VisionController.destroy);
// router.get('/', AuthController.get);
// router.get('/login', AuthController.login);
// router.get('/callback', AuthController.getCallBack);
// router.get('/refresh_token', AuthController.refreshToken);
module.exports = router;
