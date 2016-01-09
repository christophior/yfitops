var util = require('util'),
    fs = require('fs'),
    exec = require('child_process').exec,
    request = require('request'),
    path = require('./config/config.json').path;

var id3Track = function (track, fileName, trackURI, callback) {
    privateGetAlbumCoverPathThenTagTrack(trackURI, fileName, function(albumCoverPath) {
        var albumCoverExists = albumCoverPath !== '',
            cmd,
            id3Process,
            args = [
                'eyeD3',
                '-t', '"'+formatStr(track.name)+'"',
                '-a', '"'+formatStr(track.artist[0].name)+'"',
                '-A', '"'+formatStr(track.album.name)+'"',
                '-Y', track.album.date.year,
                '-n', track.number,
                '-d', track.discNumber,
            ];

        if (albumCoverExists) {
            args.push('--add-image');
            args.push('"' + escapeRegExp(albumCoverPath) + ':FRONT_COVER' + '"');
        }
        args.push('"' + escapeRegExp(fileName) + '"');
        cmd = args.join(' ');
        id3Process = exec(cmd);

        id3Process.on('exit', function() {
            if (albumCoverExists) {
                exec('rm "' + escapeRegExp(albumCoverPath) + '"');
            }
        });

        callback();
    });
};

var getTrackName = function (track) {
    var trackName = util.format('%s - %s.mp3', track.artist[0].name, track.name);
    return formatStr(trackName.replace(/\//g, ''));
};

var getArtistName = function (track) {
    var artistName = util.format('%s/', track.artist[0].name);
    return artistName;
};

var getPathName = function(){
    return (path.slice(-1) !== '/') ? path + '/' : path;
};

var getFilesizeInBytes = function (filename) {
    var stats = fs.statSync(filename);
    var fileSizeInBytes = stats['size'];
    return fileSizeInBytes;
};

var privateGetTrackId = function (trackUri) {
    var splitUri = trackUri.split(':');
    return splitUri[splitUri.length - 1];
};

/*
 *  trackUri: used to get track id to call Spotify web api
 *  fileName: used to save image locally as <song file name>.jpg
 *  callback: continue with executing id3 tagging after gathering temp copy of album artwork
*/
var privateGetAlbumCoverPathThenTagTrack = function (trackUri, fileName, callback) {
    var trackId = privateGetTrackId(trackUri),
        requestEndpoint = 'https://api.spotify.com/v1/tracks/' + trackId,
        trackData;

    request({
        url: requestEndpoint,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            trackData = body;
        }

        if (trackData && trackData.album && trackData.album.images && trackData.album.images.length > 0){
            privateSaveTemporaryArtworkImage(trackData.album.images[0].url, fileName, callback);
        } else {
            callback('');
        }
    });
};

var privateSaveTemporaryArtworkImage = function (imageUrl, fileName, callback) {
    var imagePath = fileName + '.jpg';
    request({
        url: imageUrl,
        encoding: 'binary'
    }, function (error, response, body) {
        fs.writeFile(imagePath, body, 'binary', function (err) {
            if (err) {
                callback('');
            } else {
                callback(imagePath);
            }
        });
    });

};

var formatStr = function (str) {
    var removeQuotes = str.replace(/"/g, '');
    return removeQuotes;
};

var escapeRegExp = function (str) {
    return str.replace(/[\$]/g, "\\$&");
};

module.exports = {
    id3Track: id3Track,
    getTrackName: getTrackName,
    getArtistName: getArtistName,
    getPathName: getPathName,
    getFilesizeInBytes: getFilesizeInBytes
};