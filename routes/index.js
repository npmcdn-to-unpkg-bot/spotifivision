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
// router.use(
//   FlickrController.get()
//
//   // make sure we go to the next route and don't stop here
// });
// router.get('/api/flickr/search/', FlickrController.index);
// router.get('/api/flickr/:q', FlickrController.get);
// router.get('/api/flickr/show/:id', FlickrController.show);
// router.get('/api/flickr/show/', FlickrController.show);
// CRUD routes
router.get('/test/:id', VisionController.get);
router.get('/test/', VisionController.index);
router.post('/test/', VisionController.create);
router.put('/test/:id', VisionController.update);
router.delete('/test/:id', VisionController.destroy);

// Spotify routes
router.get('/login', AuthController.login);
// router.get('/logout', AuthController.logout);
router.get('/callback', AuthController.getCallback);
router.get('/refresh_token', AuthController.refreshToken);

// Flickr routes
router.get('/api/flickr/', FlickrController.get)
router.get('/api/flickr/:id', FlickrController.get)

  // .get(FlickrController.indexFlickr)
  // method to be placed in ()


module.exports = router;
