

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
  };


$(function(e) {
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
            if($('#spotify-playlist').children().length === 1 ){
      $('.sign-link').toggleClass('hidden');
    }
      });
    });
    $('#signout').click(function(e){
      e.preventDefault();
      document.cookie='';
      $('#spotify-playlist').children().remove()
      $('.sign-link').toggleClass('hidden');
    });
    $('#searchFlickr').on('click',function(e){
      e.preventDefault();
      var q = $('#query').val();
      $.get('/api/flickr/',{q: q}).done(function(imgArray){ 

        imgArray.map(img=>{
          $('#img-container').prepend(img);

        })
      });
      // $('.sign-link').toggleClass('hidden');
    });
