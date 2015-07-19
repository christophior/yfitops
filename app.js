var Spotify = require('yfitops-web'),
    download = require('./download'),
    uri = process.argv[2];

// configurations
var config = require('./config'),
    username = config.username,
    password = config.password;

if (process.argv.length >= 3) {
    Spotify.login(username, password, function (err, spotify) {
        if (err) throw err;

        uri = Spotify.url2uri(uri);
        var uriType = Spotify.uriType(uri);

        if (uriType === 'track') {
            console.log('Given URI is a Spotify track...');
            download.track(spotify, uri, function (err) {
                spotify.disconnect();
            });
        } else if (uriType === 'playlist') {
            console.log('Given URI is a Spotify playlist...');
            download.playlist(spotify, uri, disconnect);
        } else if (uriType === 'starred') {
            var starredPlaylistUsername = getStarredPlaylistUsername(uri);
            download.starredPlaylist(spotify, starredPlaylistUsername, disconnect);
        }else {
            console.log('Invalid URI given');
        }
    });
} else {
    console.log('Please pass in a Spotify URI');
}

var getStarredPlaylistUsername = function (playlistURI) {
    var splitURI = playlistURI.split(':');
    var isStarred = splitURI[3] === 'starred' ? true : false;
    return isStarred ? splitURI[2] : undefined;
};

var disconnect = function (spotify) {
    spotify.disconnect();
};