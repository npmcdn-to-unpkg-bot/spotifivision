var express = require('express');
var router = express.Router();

var VisionController = require('../controllers/VisionController.js');
var AuthController = require('../controllers/AuthController.js');
var FlickrController = require('../controllers/FlickrController.js');

/* GET home page. */

router.get('/', function(req, res) {
  res.render("index", {title: "hello"});
});

router.get('/test/:id', VisionController.get);
router.get('/test/', VisionController.index);
router.post('/test/', VisionController.create);
router.put('/test/:id', VisionController.update);
router.delete('/test/:id', VisionController.destroy);

// Spotify routes
router.get('/login', AuthController.login);

router.get('/callback', AuthController.getCallback);
router.get('/refresh_token', AuthController.refreshToken);

// Flickr routes
router.get('/api/flickr', FlickrController.get);
router.get('/api/flickr/src/', FlickrController.getSrc);


module.exports = router;
