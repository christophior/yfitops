var spotifyPlaylist = require('spotify-playlist'),
    util = require('util'),
    async = require('async'),
    fs = require('fs'),
    path = require('./config').path;


var downloadTrack = function (spotify, trackURI, callback) {
    spotify.get(trackURI, function (err, track) {
        if (err) {
            spotify.disconnect();
            throw err;
        }

        var trackName = getTrackName(track);
        var fileName = util.format('%s%s', getPathName(), trackName);

        if (fs.existsSync(fileName)) {
            console.log('\t%s already exists', trackName);
            callback();
        } else {
            console.log('\tDownloading: %s', trackName);
            var file = fs.createWriteStream(fileName);

            track.play()
                .pipe(file)
                .on('finish', function () {
                    file.end();
                    callback();
                });
        }
    });
};

var downloadPlaylist = function (spotify, uri, callback) {
    spotifyPlaylist.playlistUri(uri, function (err, result) {

        console.log('Downloading playlist:');
        var tracksArray = result.playlist.tracks;
        async.forEachOfSeries(tracksArray, function (track, index, callback) {
            downloadTrack(spotify, track.href, function (err) {
                callback();
            });
        }, function (err) {
            if (err) {
                console.error(err.message);
            }
            callback();
        });
    });
};

var getTrackName = function (track) {
    var trackName = util.format('%s - %s.mp3', track.artist[0].name, track.name);
    return trackName.replace(/\//g, '');
};

var getPathName = function(){
    return (path.slice(-1) !== '/') ? path + '/' : path;
};

module.exports = {
    track: downloadTrack,
    playlist: downloadPlaylist
}