require('dotenv').config();
var express = require('express');
var Flickr = require("node-flickr");
var Path = require('path');
var request = require('request');


function get(req,res,err){
  let keys = {"apikey": process.env.FLICKR_API_KEY};

  let flickr = new Flickr(keys);
  flickr.get("photos.search", {"text": req.query.q,"api_key": process.env.FLICKR_API_KEY,"secret":process.env.FLICKR_CLIENT_SECRET}, function(err, result){
      if (err) return console.error(err);
      let r = result['photos']['photo'];
      // use map so we can have an array
      var count = 0;
      images= r.map( x=>{ 
        while(count < 30){
          count++;
          return "<div class='jigga'><img src='https://farm"+x.farm+".staticflickr.com/"+x.server+"/"+x.id+"_"+x.secret+".jpg'></div>";
        }
        });
      res.send(images);
  });
};
function getSrc(req,res,err){
  let keys = {"apikey": process.env.FLICKR_API_KEY};

  let flickr = new Flickr(keys);
  flickr.get("photos.search", {"text": req.query.q,"api_key": process.env.FLICKR_API_KEY,"secret":process.env.FLICKR_CLIENT_SECRET}, function(err, result){
  // console.log(req.body);
      if (err) return console.error(err);
      var s = result['photos']['photo'];
      var i = [];
      var count = 0;
      isrc = s.map( x=>{ 
        while(count < 30){
          count++;
          return "https://farm"+x.farm+".staticflickr.com/"+x.server+"/"+x.id+"_"+x.secret+".jpg";
        }
        });
      res.send(isrc);
  });
};
module.exports = {
  get: get,
  getSrc: getSrc
  // post: post
  // index: index,
  // create: create,
  // update: update,
  // destroy: destroy
}
