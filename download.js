var util = require('util'),
    async = require('async'),
    fs = require('fs'),
    id3Track = require('./utils').id3Track,
    getTrackName = require('./utils').getTrackName,
    getPathName = require('./utils').getPathName,
    getFilesizeInBytes = require('./utils').getFilesizeInBytes;


var downloadTrack = function (spotify, trackURI, callback) {
    spotify.get(trackURI, function (err, track) {
        if (err) {
            spotify.disconnect();
            throw err;
        }

        var isTrackAvailable = spotify.isTrackAvailable(track, spotify.country),
            trackName = getTrackName(track),
            fileName = util.format('%s%s', getPathName(), trackName),
            trackAlreadyExists = fs.existsSync(fileName) && getFilesizeInBytes(fileName) !== 0;

        if (trackAlreadyExists) {
            console.log('\t%s already exists', trackName);
            callback();
        } else if (!isTrackAvailable) {
            console.log('\t%s is not available in your country', trackName);
            callback();
        } else {
            console.log('\tDownloading: %s', trackName);
            var file = fs.createWriteStream(fileName);

            track.play()
                .pipe(file)
                .on('finish', function () {
                    id3Track(track, fileName, trackURI, function () {
                        console.log('\t\tID3\'d: %s', trackName);
                    });
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
        privateLoopThroughTracks(spotify, tracksArray, callback);
    });
};

var downloadStarredPlaylist = function (spotify, username, callback) {
    spotify.starred(username, function (err, starred) {
        if (err) throw err;
        console.log('Downloading starred playlist:');
        var tracksArray = starred.contents.items;
        privateLoopThroughTracks(spotify, tracksArray, callback);
    });
};

var privateLoopThroughTracks = function (spotify, tracksArray, callback) {
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
};

module.exports = {
    track: downloadTrack,
    playlist: downloadPlaylist,
    starredPlaylist: downloadStarredPlaylist
};
