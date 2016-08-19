require('dotenv').config();
var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var _ = require('underscore');
var ejs = require('ejs');
var logger = require('morgan');
var mongoose = require('mongoose');
var authOptions = require('./config/auth_options');
var request = require('request'); // "Request" library
var cookieParser = require('cookie-parser');
var bodyParser= require('body-parser');

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


mongoose.connect('mongodb://localhost/spotifivision');

// var flickr = new Flickr({
//   api_key: process.env.FLICKR_CONSUMER_KEY,
//   progress: false
// });
// var Flickr = require("flickrapi"),
//   flickrOptions = {
//     api_key: process.env.FLICKR_CONSUMER_KEY,
//     secret: process.env.FLICKR_CONSUMER_SECRET
//   };
// Flickr.tokenOnly(flickrOptions, function(error, flickr){
  // we can now use "flickr" as our API object,
  // but we can only call public methods and access public data
// });

var routes = require('./routes/index');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// flickr test route

app.use('/api', routes);
console.log('Magic happens on port 3000');
// var FlkPix = require('.//models/pix');



module.exports = app;
