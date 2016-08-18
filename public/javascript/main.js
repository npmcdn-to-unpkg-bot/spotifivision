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
  }
<<<<<<< HEAD
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
    function getPlaylist(){

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
    }
    $.ajax({
      url: 'https://api.spotify.com/v1/me',
      headers: {
        'Authorization': 'Bearer ' + getAccessToken()
      },
      success: function(bearRes) {
        userProfilePlaceholder.innerHTML = userProfileTemplate(bearRes);
       var access_token = params.access_token,
       refresh_token = params.refresh_token,
       error = params.error;
       function playList(data, index){

       }
       var playlistData = function(json){
        var data
        data["items"].map(p=>{
          var playlistName = p["name"];
          var imagesArray = p["images"];
          imagesArray.map(img=>{
            var url = img["url"];
            console.log(url)
          })
        })
      }

      if (error) {
        alert('There was an error during the authentication');
      } else {
        if (access_token) {
            // render oauth info
            oauthPlaceholder.innerHTML = oauthTemplate({
              access_token: access_token,
              refresh_token: refresh_token
            });
        }
            $.ajax({
              url: 'https://api.spotify.com/v1/me/playlists',
              headers: {
                'Authorization': 'Bearer ' + access_token
              },
              success: function(response) {
                console.log("Playlist Names" +  response.items.map(n =>{return n.name}));
                // userPlaylistSource.innerHTML=response;

                userPlaylistsPlaceholder.innerHTML = userPlaylistTemplate(response.items[0]);
              }
            });
            $.ajax({
              url: 'https://api.spotify.com/v1/me',
              headers: {
                'Authorization': 'Bearer ' + access_token
              },
              success: function(response) {
                userProfilePlaceholder.innerHTML = userProfileTemplate(response);

                $('#login').hide();
                $('#loggedin').show();

=======
       var access_token = params.access_token,
       refresh_token = params.refresh_token,
       error = params.error;
       function playList(data, index){

       }
       var playlistData = function(json){
        var data
        data["items"].map(p=>{
          var playlistName = p["name"];
          var imagesArray = p["images"];
          imagesArray.map(img=>{
            var url = img["url"];
            console.log(url)
          })
        })
      }

      if (error) {
        alert('There was an error during the authentication');
      } else {
        if (access_token) {
            // render oauth info
            oauthPlaceholder.innerHTML = oauthTemplate({
              access_token: access_token,
              refresh_token: refresh_token
            });
        }
            $.ajax({
              url: 'https://api.spotify.com/v1/me/playlists',
              headers: {
                'Authorization': 'Bearer ' + access_token
              },
              success: function(response) {
                console.log("Playlist Names" +  response.items.map(n =>{return n.name}));
                // userPlaylistSource.innerHTML=response;

                userPlaylistsPlaceholder.innerHTML = userPlaylistTemplate(response.items[0]);
              }
            });
            $.ajax({
              url: 'https://api.spotify.com/v1/me',
              headers: {
                'Authorization': 'Bearer ' + access_token
              },
              success: function(response) {
                userProfilePlaceholder.innerHTML = userProfileTemplate(response);

                $('#login').hide();
                $('#loggedin').show();

>>>>>>> Stashed changes
              }
            });
          } else {
              // render initial screen
              $('#login').show();
              $('#loggedin').hide();
            }


<<<<<<< Updated upstream
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
=======
>>>>>>> Stashed changes
            document.getElementById('obtain-new-token').addEventListener('click', function() {
              $.ajax({
                url: '/refresh_token',
                data: {
                  'refresh_token': refresh_token
                }
              }).done(function(data) {
                access_token = data.access_token;
                oauthPlaceholder.innerHTML = oauthTemplate({
                  access_token: access_token,
                  refresh_token: refresh_token
                });
              });
            }, false);
          }
        })()
=======
}).then(function (data) {
  console.log(data)
})


$.ajax({
  url: 'https://api.spotify.com/v1/me',
  headers: {
    'Authorization': 'Bearer ' + getAccessToken()
  }
}).then(function (data) {
  console.log(data)
})
>>>>>>> f273b84313768df72c29953f6d3a08cf347c69fd
