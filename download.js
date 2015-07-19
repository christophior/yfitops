var util = require('util'),
    async = require('async'),
    fs = require('fs'),
    path = require('./config').path;


var downloadTrack = function (spotify, trackURI, callback) {
    spotify.get(trackURI, function (err, track) {
        if (err) {
            spotify.disconnect();
            throw err;
        }

        var isTrackAvailable = spotify.isTrackAvailable(track, spotify.country);
        var trackName = getTrackName(track);
        var fileName = util.format('%s%s', getPathName(), trackName);

        if (fs.existsSync(fileName) && getFilesizeInBytes(fileName) !== 0) {
            console.log('\t%s already exists', trackName);
            callback();
        } else if (!isTrackAvailable) {
            console.log('%s is not available in your country', trackName);
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

var downloadPlaylist = function (spotify, playlistURI, callback) {
    spotify.playlist(playlistURI, function (err, playlist) {
        if (err) throw err;
        console.log('Downloading playlist:');
        var tracksArray = playlist.contents.items;

        async.forEachOfSeries(tracksArray, function (track, index, callback) {
            downloadTrack(spotify, track.uri, function (err) {
                callback();
            });
        }, function (err) {
            if (err) {
                console.error(err.message);
            }
            callback(spotify);
        });
    });
};

var downloadStarredPlaylist = function (spotify, username, callback) {
    spotify.starred(username, function (err, starred) {
        if (err) throw err;
        console.log('Downloading starred playlist:');
        var tracksArray = starred.contents.items;

        async.forEachOfSeries(tracksArray, function (track, index, callback) {
            downloadTrack(spotify, track.uri, function (err) {
                callback();
            });
        }, function (err) {
            if (err) {
                console.error(err.message);
            }
            callback(spotify);
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

var getFilesizeInBytes = function (filename) {
    var stats = fs.statSync(filename);
    var fileSizeInBytes = stats['size'];
    return fileSizeInBytes;
};

module.exports = {
    track: downloadTrack,
    playlist: downloadPlaylist,
    starredPlaylist: downloadStarredPlaylist
};