var Spotify = require('yfitops-web'),
    download = require('./download'),
    isConfig = process.argv[2] === 'config',
    config = require('./config/config'),
    read = require('read'),
    uri = process.argv[2];


if (isConfig) {
    read({ prompt: 'Username: ', silent: false }, function(er, username) {
        read({ prompt: 'Password (will not be shown when typed): ', silent: true }, function(er, password) {
            read({ prompt: 'Download directory (e.g. /Users/username/Music): ', silent: false }, function(er, directory) {
                config.configCredentials(username, password, directory);
            });
        });
    });
} else if (process.argv.length >= 3) {
    // configurations
    var configData = require('./config/config.json'),
        username = configData.username,
        password = configData.password.length === 32 ? config.decryptPassword(configData.password) : configData.password;
    if (!username || !password) {
        console.log('username/password not present, please run \'node app.js config\'');
    }

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
        } else {
            console.log('Invalid URI given');
        }
    });
} else {
    console.log('Please pass in a Spotify URI');
}

var getStarredPlaylistUsername = function (playlistURI) {
    var splitURI = playlistURI.split(':');
    var isStarred = splitURI[3] === 'starred';
    return isStarred ? splitURI[2] : undefined;
};

var disconnect = function (spotify) {
    spotify.disconnect();
};