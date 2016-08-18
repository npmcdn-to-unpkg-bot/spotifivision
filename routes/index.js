var express = require('express');
var router = express.Router();

var VisionController = require('../controllers/VisionController.js');
var AuthController = require('../controllers/AuthController.js');
var FlickrController = require('../controllers/FlickrController.js');

/* GET home page. */

// Flickr test to make sure everything is working (accessed at GET http://localhost:3000/api)
router.get('/', function(req, res) {
  res.render("index", {title: "hello"});
});
router.use(function(req, res, next){
  console.log('Something is happening with Flickr');
  next();
  // make sure we go tot he next route and don't stop here
});

// CRUD routes
router.get('/test/:id', VisionController.get);
router.get('/test/', VisionController.index);
router.post('/test/', VisionController.create);
router.put('/test/:id', VisionController.update);
router.delete('/test/:id', VisionController.destroy);

// Spotify routes
router.get('/login', AuthController.login);
// router.delete('/logout', AuthController.logout);
router.get('/callback', AuthController.getCallback);
router.get('/refresh_token', AuthController.refreshToken);

// Flickr routes
router.get('/api/flickr/', FlickrController.get)
  // .get(FlickrController.indexFlickr)
  // method to be placed in ()


module.exports = router;
