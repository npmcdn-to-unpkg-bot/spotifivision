
var express = require('express');

function get (req, res, next) {
  // res.send(res.body);
  // res.render('home', { title: 'Express', response: res});
  res.render('index', { title: 'Express'});
  // res.json(res);
  // res.render('index', { title: 'Express'});
  // model.findOne({ _id: req.params.id }, function (err, model) {
  //   if (err) console.log(err)
  //   res.json(model)
  // })
}

function index (req, res, next) {
  // res.send(res.body);
  res.render('index', { title: 'Express'});
  // res.send(res);
  // model.findOne({ _id: req.params.id }, function (err, model) {
  //   if (err) console.log(err)
  //   res.json(model)
  // })
}

function create (req, res, next) {
  res.render('index', { title: 'Express' });
  // model.create(model, function(err, model){
  //   if (err) console.log(err)
  //   res.json(model)
  // })
}

function update (req, res, next) {
  res.render('index', { title: 'Express' });
  // model.findOneAndUpdate({_id: req.params.id}, model, function(err, model){
  //   if (err) console.log(err)
  //   res.json(model)
  // })
}

function destroy (req, res, next) {
  res.render('index', { title: 'Express' });
  // model.findOneAndUpdate({_id: req.params.id}, model, function(err){
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
