require('dotenv').config();
var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');

var request = require('request'); // "Request" library
var _= require('lodash');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var bodyParser= require('body-parser');
var db = mongoose.connection;
// mongoose.connect('mongodb://localhost/spotifivision');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});
var flickr = new Flickr({
  api_key:FLICKR_CONSUMER_KEY,
  progress: false
});
var Flickr = require("flickrapi"),
  flickrOptions = {
    api_key: FLICKR_CONSUMER_KEY,
    secret: FLICKR_CONSUMER_SECRET
  };
Flickr.tokenOnly(flickrOptions, function(error, flickr){
  // we can now use "flickr" as our API object,
  // but we can only call public methods and access public data
});
var routes = require('./routes/index');
// var authRoute= require('./routes/users');
// var spotAuth= require('./routes/spotify');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
// app.use('/login', authRoute);
// app.use(express.static(__dirname + '/public')).use(cookieParser());




// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   // we're connected!
// });
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });


if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
