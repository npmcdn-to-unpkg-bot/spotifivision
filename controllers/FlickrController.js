var express = require('express');
// endpoint
var FlickrUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=5bfa45a5e0986c04bbf0f3654f987314&format=json&nojsoncallback=1&text=cats&extras=url_o";
var Path = require('path');
var request = require('request');
// var Flickr = require("flickrapi"),
//   flickrOptions = {
//     api_key: process.env.CLIENT_ID,
//     secret: process.env.CLIENT_SECRET
//   };
//   Flickr.tokenOnly(flickrOptions, function(error, flickr) {
//     // we can now use "flickr" as our API object,
//     // but we can only call public methods and access public data
//   });
//
// // module.exports = {
// //   indexFlickr: function(req, res){
// function get(req, res, next) {
//   Pix.find({ })
// }

function get(req, res, next)  {
  request.get(FlickrUrl, function(err, data, body){
    if (!err && data.statusCode == 200){
      var url_o = JSON.parse(body)
      var photo = url_o.photos.photo
      var photoArray = photo.map(function(p){
        return p.url_o
      }).filter(function(uri) {
        return uri !== undefined
      })
      res.json(photoArray)
    }
  });
}
module.exports = {
  get: get
  // index: index,
  // create: create,
  // update: update,
  // destroy: destroy
}
