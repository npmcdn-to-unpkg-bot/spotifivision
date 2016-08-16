function getAccessToken() {
  return document.cookie.split('=')[1];
}

$.ajax({
  url: 'https://api.spotify.com/v1/me/playlists',
  headers: {
    'Authorization': 'Bearer ' +getAccessToken()
  }
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
