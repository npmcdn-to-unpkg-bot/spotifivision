res.render('index', { title: 'Express' });

function get (req, res, next) {
  res.render('index', { title: 'Express' });
  // model.findOne({ _id: req.params.id }, function (err, model) {
  //   if (err) console.log(err)
  //   res.json(model)
  // })
}

function index (req, res, next) {
  res.render('index', { title: 'Express' });
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
