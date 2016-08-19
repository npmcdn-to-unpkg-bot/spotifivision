function generateRandomString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
var state = generateRandomString(16);
var stateKey = 'spotify_auth_state';
function getAccessToken() {
  var entries = document.cookie.split(';')
  var token = false
  entries.forEach(function (entry) {
      var pieces = entry.trim().split('=')
      if (pieces[0] === 'access_token') {
            token = pieces[1]
          }
    })
  return token
}

  $.ajax({
    url: 'https://api.spotify.com/v1/me/playlists',
    headers: {
        'Authorization': 'Bearer ' +getAccessToken()
      },
      encode: true
  }).then(function (d) {
      return d;
  });

$.ajax({
  url: 'https://api.spotify.com/v1/me',
  headers: {
      'Authorization': 'Bearer ' + getAccessToken()
  },
  encode: true
}).then(function (data) {
  var iframeSrc= data["external_urls"].spotify.toString();
  var  playlistIframe = $('<iframe id="user-playlists" src="' + iframeSrc + '" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>');
  $('#spotify-playlist').prepend(playlistIframe);
  $('body').prepend($('<style>#user-playlists { height: 100vh; z-index: 0;}canvas{width:100vw;height:100vh;position:absolute;}</style>'));
});
// var query = document.getElementById('searchFlickr').value;
// console.log(query);
    // query.toLowerCase();

// $.get("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=5bfa45a5e0986c04bbf0f3654f987314&format=json&nojsoncallback=1&text=" + value.toString() +"&extras=url_o").done(function(d){alert(d);});

var flickr = new Flickr({
  api_key: "1234ABCD1234ABCD1234ABCD1234ABCD"
});
$('#searchFlickr').click(function(e){
  e.preventDefault();

  var query = $('#tags').value();
  alert(query);
 $.get('/api/flickr/?tags=dogs').done(function(imgArray){ 
  imgArray(img=>{$('#img-container').append(img);})
  });
});
