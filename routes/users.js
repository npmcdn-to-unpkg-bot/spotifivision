var express = require('express');
<<<<<<< HEAD
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

router.get('/auth/flickr',
  passport.authenticate('flickr'),
  function(req, res){
    // The request will be redirected to Flickr for authentication, so this
    // function will not be called.
  });

router.get('/auth/flickr/callback',
  passport.authenticate('flickr', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
=======
var auth = express.Router();
var AuthController = require('../controllers/AuthController')
/* GET users listing. */
auth.get('/', AuthController.get);
auth.get('/login', AuthController.login);
auth.get('/callback', AuthController.getCallBack);
auth.get('/refresh_token', AuthController.refreshToken);
module.exports = auth;
>>>>>>> 88080cf5118f3e24c1b3bc2c3b34be9ba6852ff2
