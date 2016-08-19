var express = require('express');
var Flickr = require("node-flickr");
var Path = require('path');
var request = require('request');


function get(req,res,err){
  var keys = {"apikey": process.env.FLICKR_API_KEY};

  var flickr = new Flickr(req);
  flickr.get("photos.search", {"tags":req.body.query,"api_key": process.env.FLICKR_API_KEY,"secret":req.body.secret}, function(err, result){
      if (err) return console.error(err);
      var r = result['photos']['photo'];
      var idArray = [];
      r.map(id=>{idArray.push(id)});
      var ownerMap = idArray.map(photo=>{return })
      console.log(res.id);
      images= idArray.map(x=>{ return "<img src='https://farm"+x.farm+".staticflickr.com/"+x.server+"/"+x.id+"_"+x.secret+".jpg'>";});
      res.send(images.map(x=>{ return x;}));
  });

};
module.exports = {
  get: get
  // show: show
  // index: index,
  // create: create,
  // update: update,
  // destroy: destroy
}
