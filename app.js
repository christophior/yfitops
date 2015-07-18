var Spotify = require('spotify-web'),
    download = require('./download'),
    uri = process.argv[2];

// configurations
var config = require('./config'),
    username = config.username,
    password = config.password;

if (process.argv.length >= 3) {
    Spotify.login(username, password, function (err, spotify) {
        if (err) throw err;

        var uriType = Spotify.uriType(uri);

        if (uriType === 'track') {
            console.log('Given URI is a Spotify track...');
            download.track(spotify, uri, function (err) {
                spotify.disconnect();
            });
        } else if (uriType === 'playlist') {
            console.log('Given URI is a Spotify playlist...');
            var starredPlaylistUsername = getStarredPlaylistUsername(uri);
            if (starredPlaylistUsername){
                download.starredPlaylist(spotify, starredPlaylistUsername, disconnect);
            } else {
                download.playlist(spotify, uri, disconnect);
            }
        } else {
            console.log('Invalid URI given');
        }
    });
} else {
    console.log('Please pass in a Spotify URI');
}

var getStarredPlaylistUsername = function (playlistURI) {
    var splitURI = playlistURI.split(':');
    var isStarred = splitURI[3] === 'starred' ? true : false;
    console.log(isStarred);
    console.log(splitURI[2]);
    return isStarred ? splitURI[2] : undefined;
};

var disconnect = function (spotify) {
    spotify.disconnect();
};