
var express = require('express');

function get (req, res, next) {
  res.render('index', { title: 'Express' });
  // User.findOne({ _id: req.params.id }, function (err, user) {
  //   if (err) console.log(err)
  //   res.json(user)
  // })
}

function index (req, res, next) {
  res.render('index', { title: 'Express' });
  // User.findOne({ _id: req.params.id }, function (err, user) {
  //   if (err) console.log(err)
  //   res.json(user)
  // })
}

function create (req, res, next) {
  res.render('index', { title: 'Express' });
  // User.create(user, function(err, user){
  //   if (err) console.log(err)
  //   res.json(user)
  // })
}

function update (req, res, next) {
  res.render('index', { title: 'Express' });
  // User.findOneAndUpdate({_id: req.params.id}, user, function(err, user){
  //   if (err) console.log(err)
  //   res.json(user)
  // })
}

function destroy (req, res, next) {
  res.render('index', { title: 'Express' });
  // User.findOneAndUpdate({_id: req.params.id}, user, function(err){
  //   if (err) console.log(err)
  //   res.json({ msg: "DELETED!"})
  // })
}

module.exports = {
  get: get,
  index: index,
  create: create,
  update: update,
  destroy: destroy
}
