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
  // console.log('line 35 : ' + iframeSrc, data["external_urls"].spotify.toString());
  var  playlistIframe  = $('<iframe id="user-playlists">').attr('src',iframeSrc).width('100vw').height('100vh');
  $('body').prepend(playlistIframe);
  $('body').prepend($('<style>#user-playlists { position: absolute; float: left; clear: both; width: 100%; height: 350px; z-index: 0; left no-repeat; }canvas{width:100vw;height:100vh;position:absolute;}</style>'));
});
