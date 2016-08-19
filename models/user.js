
var mongoose = require('mongoose');
var userSchema= mongoose.Schema({
    name: String
});
// Flickr
var FlickrSchema = mongoose.Schema ({
   url_o: String,
   userId: String
})
var User = mongoose.model('User', userSchema);
// Flickr
var pix = mongoose.model('Pix', FlickrSchema);

module.exports = User, Pix;
