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
      res.id = r[0]['id'];
      console.log(res.id);
      idArray = idArray.map(photo=>{return photo.id});
      res.json(r);
      // res.render('index',{'ids': idArray });
      // res.id = idArray[0]['id'].toString();
      // res.redirect('/api/flickr/show')
  });
  // flickr.get("photos.getContext", {"photo_id":req.id}, function(err, result){
  //     if (err) return console.error(err);
  //     console.log(result);
  // });

};
// function show(res,req,error){
//   if(error){console.log(error)};
// // res.json(res);
// // console.log(req);
// flickr.get("photos.getContext", {"photo_id":req.id}, function(err, result){
//     if (err) return console.error(err);
//     console.log(result);
// });
//
// // res.render('show_images',{"id": req.id});
// }
module.exports = {
  get: get
  // show: show
  // index: index,
  // create: create,
  // update: update,
  // destroy: destroy
}
