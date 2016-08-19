require('dotenv').config();
var express = require('express');
var Flickr = require("node-flickr");
var Path = require('path');
var request = require('request');


function get(req,res,err){
  let keys = {"apikey": process.env.FLICKR_API_KEY};

  let flickr = new Flickr(keys);
  flickr.get("photos.search", {"text": req.query.q,"api_key": process.env.FLICKR_API_KEY,"secret":process.env.FLICKR_CLIENT_SECRET}, function(err, result){
  // console.log(req.body);
      if (err) return console.error(err);
      let idArray = [];
      let r = result['photos']['photo'];
      r.map(id=>{idArray.push(id)});
      images= idArray.map(x=>{ return "<div class='jigga'><img src='https://farm"+x.farm+".staticflickr.com/"+x.server+"/"+x.id+"_"+x.secret+".jpg'></div>";});
      res.json(images.map(x=>{ return x;}));
  });
};
module.exports = {
  get: get
  // post: post
  // index: index,
  // create: create,
  // update: update,
  // destroy: destroy
}
