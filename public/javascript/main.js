$(function() {
  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  function getAccessToken() {return document.cookie.split('=')[1]; };

  var userProfileSource = document.getElementById('user-profile-template').innerHTML,
  userProfileTemplate = Handlebars.compile(userProfileSource),
  userProfilePlaceholder = document.getElementById('user-profile'),
  userPlaylistsPlaceholder = document.getElementById('user-playlists'),
  userPlaylistSource = document.getElementById('user-playlist-container').innerHTML,
  userPlaylistTemplate = Handlebars.compile(userPlaylistSource);

  var oauthSource = document.getElementById('oauth-template').innerHTML,
  oauthTemplate = Handlebars.compile(oauthSource),
  oauthPlaceholder = document.getElementById('oauth');

  var params = getHashParams();

  // var getAccessToken() = params.getAccessToken(),
  refresh_token = params.refresh_token,
  error = params.error;

  function playList(data, index) {

  }
  var playlistData = function(json) {
    var data;
    data["items"].map(p => {
      var playlistName = p["name"];
      var imagesArray = p["images"];
      imagesArray.map(img => {
        var url = img["url"];
        console.log(url)
      })
    })
  }

  if (error) {
    alert('There was an error during the authentication');
  } else {
    if (getAccessToken()) {
    // render oauth info
    oauthPlaceholder.innerHTML = oauthTemplate({
      access_token: getAccessToken(),
      refresh_token: refresh_token
    });

    $.ajax({
      url: 'https://api.spotify.com/v1/me/playlists',
      headers: {
        'Authorization': 'Bearer ' +getAccessToken() 
      },
      success: function(playRes) {
        console.log("Playlist Names" + playRes.items.map(n => {
          return n.name
        }));
        userPlaylistSource.innerHTML=playRes;

        userPlaylistsPlaceholder.innerHTML = userPlaylistTemplate(playRes.items[0]);
      }
    });
    $.ajax({
      url: 'https://api.spotify.com/v1/me',
      headers: {
        'Authorization': 'Bearer ' + getAccessToken() 
      },
      success: function(bearRes) {
        userProfilePlaceholder.innerHTML = userProfileTemplate(bearRes);

        $('#login').hide();
        $('#loggedin').show();

      }
    });
  } else {
    $('#login').show();
    $('#loggedin').hide();
  }


  document.getElementById('obtain-new-token').addEventListener('click', function() {
    $.ajax({
      url: '/refresh_token',
      data: {
        'refresh_token': refresh_token
      }
    }).done(function(data) {
      getAccessToken() = data.getAccessToken();
      oauthPlaceholder.innerHTML = oauthTemplate({
        access_token: getAccessToken(),
        refresh_token: refresh_token
      });
    });
  }, false);
}
})();