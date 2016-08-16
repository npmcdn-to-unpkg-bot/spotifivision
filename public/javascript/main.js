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
