var util = require('util'),
    fs = require('fs'),
    exec = require('child_process').exec,
    path = require('./config/config.json').path;

var idTrack = function (track, fileName, callback) {
    var args = [
            'eyeD3',
            '-t', '"'+track.name+'"',
            '-a', '"'+track.artist[0].name+'"',
            '-A', '"'+track.album.name+'"',
            '-Y', '"'+track.album.date.year+'"',
            '"' + fileName + '"'
        ],
        cmd = args.join(' ');
    exec(cmd);
    callback();
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
    idTrack: idTrack,
    getTrackName: getTrackName,
    getPathName: getPathName,
    getFilesizeInBytes: getFilesizeInBytes
};