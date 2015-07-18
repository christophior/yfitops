var Spotify = require('spotify-web'),
    download = require('./download'),
    uri = process.argv[2];

// configurations
var config = require('./config'),
    username = config.username,
    password = config.password;

Spotify.login(username, password, function (err, spotify) {
    if (err) {
        throw err;
    }

    var uriType = uri.split(':');

    if (uriType[1] === 'track') {
        console.log('Given URI is a Spotify track...');
        download.track(spotify, uri, function (err) { spotify.disconnect(); });
    } else {
        console.log('Given URI is not a track, checking if URI is for a playlist...');
        download.playlist(spotify, uri, function (err) { spotify.disconnect(); });
    }
});