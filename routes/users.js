var express = require('express');
var router = express.Router();
var passport = require('passport');


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
