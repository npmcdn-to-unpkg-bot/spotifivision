var flickrSearch, getAccessToken, getUrlFromJson, loadPlaylist, flickrSrcArray;
/* wait for window to load*/
getAccessToken = function() {
  // get all cookies
    let entries = document.cookie.split(';')
  // let default value of token to false
    let token = false
    entries.forEach(function(entry) {
        let pieces = entry.trim().split('=')
        if (pieces[0] === 'access_token') {
            token = pieces[1]
        }
    })
    return token
};

getUrlFromJson = function(data) {
    return data["external_urls"].spotify.toString();
}

deleteCookieAndPlaylist = function() {
    document.cookie = '';
    $('#spotify-playlist').children().remove()
    $('.sign-link').toggleClass('hidden');
}

flickrSrcArray = function(q) {
    /* 
     make an ajax call to api rest path
     set query terms as req.query param 
  */
    $.ajax({
        url: '/api/flickr/src/?q=' + q,
        method: 'get',
    }).done(function(imgArray) {
        imgArray.map(img => {
            $('#columns').prepend(img)
        });
    }).then(function() {
        setTimeout(500);
    });
};
flickrSearch = function(searchTerms) {
    /* ajax call to api rest path set query terms as req.query param */
    var container= $("<div id='columns'></div>");
    $.ajax({
        url:'/api/flickr/?q='+searchTerms,
        method: 'get',
        // setting context allows us to define this
        context: document.getElementById('columns'),
        // dont process the data, just leave it we gotta do shit to it anyway 
        processData: false
    }).done(function(array){ 
      let a = array.join('');
      let el = $("<div id='columns'>"+ a + "</div>");
      $('#wrapper').prepend(el); 
    })
};

loadPlaylist = function() {
    $.ajax({
        url: 'https://api.spotify.com/v1/me',
        method:'get',
        headers: {
            'Authorization': 'Bearer ' + getAccessToken()
        }
    }).then(function(data) {
        var iframeSrc = data["external_urls"].spotify.toString();
        var playlistIframe = $('<iframe id="user-playlists" src="' + iframeSrc + '" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>');
        $('#spotify-playlist').append(playlistIframe);
        $('body').prepend($('<style>#user-playlists { height: 100vh; z-index: 0;}canvas{width:100vw;height:100vh;position:absolute;}</style>'));
        if ($('#spotify-playlist').children().length === 1) {
            $('.sign-link').toggleClass('hidden');
        }
    });
};


// document window onload
$(function() {

    // check if access token exists
    if (document.cookie != '' || document.cookie != undefined) {
        // if cookie exists load playlist
        loadPlaylist();
    };


    // event listener for signout button 
})

$('#signout').click(function(e) {
    deleteCookieAndPlaylist();
});

// listen for click event on search button
$('#searchFlickr').on('click', function(e) {
    e.preventDefault();
    // get search input value
    var query = $('#query').attr('value');
    // get and apply search results
    flickrSearch(query);
});

$(document).on('keyup', function(e) {
    e.preventDefault();
    var q = $('#query').val();
    console.log(e.type, e.which);
    if (!(q == undefined || q == '') && (e.keyCode == 13)) {
        flickrSearch(q);
    }
})