'use strict';

var path = require('path');
var fs = require('fs');
var mongoosePagination = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(request, response) {
    var song_id = request.params.id;
    Song.findById(song_id).populate({ path: 'album' }).exec((err, data) => {
        if (err) {
            response.status(500).send({ message: "internal server error getting the song" });
        } else {
            if (!data) {
                response.status(404).send({ message: "this song not exists" });

            } else {
                response.status(200).send({ song: data });

            }
        }
    });
}

function saveSong(request, response) {
    var song = new Song();
    var params = request.body;
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;
    song.save((err, data) => {
        if (err) {
            response.status(500).send({ message: 'internal server error saving song' });
        } else {
            if (data) {
                response.status(200).send({ song_saved: data });
            } else {
                response.status(404).send({ message: 'song not saved' });
            }
        }
    });
}

function getSongs(request, response) {
    var album_id = request.params.album;

    var find = album_id ? Song.find({ album: album_id }).sort('number') : Song.find({}).sort('number');
    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec((err, data) => {
        if (err) {
            response.status(500).send({ message: 'internal server error getting songs' });
        } else {
            if (data) {
                response.status(200).send({ songs: data });
            } else {
                response.status(404).send({ message: 'songs not found' });
            }
        }
    });
}


function updateSongs(request, response) {
    var song_id = request.params.id;
    var update = request.body;

    Song.findByIdAndUpdate(song_id, update, (err, data) => {
        if (err) {
            response.status(500).send({ message: 'internal server error updating songs', error: err });
        } else {
            if (data) {
                response.status(200).send({ song_updated: data });
            } else {
                response.status(404).send({ message: 'songs not updated (maybe the song not exists)' });
            }
        }
    });
}


function deleteSong(request, response) {
    var song_id = request.params.id;
    Song.findByIdAndRemove(song_id, (err, data) => {
        if (err) {
            response.status(500).send({ message: 'internal server error deleting song', error: err });
        } else {
            if (data) {
                response.status(200).send({ song_deleted: data });
            } else {
                response.status(404).send({ message: 'songs not deleted (maybe the song not exists)' });
            }
        }
    })
}

function uploadSongFile(request, response) {
    var song_id = request.params.id;
    var file_name = 'Not uploaded!!!';
    if (request.files) {
        console.log(request.files.image.path.split('/')[2]);
        file_name = request.files.image.path.split('/')[2];
        var ext = file_name.split('.')[1];
        if (ext == 'mp3') {
            Song.findByIdAndUpdate(song_id, { file: file_name }, (err, data) => {
                if (err) {
                    response.status(500).send({ message: "Error updating song file" });
                } else {
                    if (data) {
                        response.status(200).send({ song_updated: data });
                    }
                    else {
                        response.status(404).send({ message: "song file not saved" });
                    }
                }
            });
        } else {
            response.status(200).send({ message: 'plase, send a MP3 file(".mp3")' });
        }
    } else
        response.status(200).send({ message: 'mp3 file is required' });
}


function getSongFile(request, response) {
    var song_file = request.params.file;
    fs.exists('./upload/songs/' + song_file, (exists) => {
        if (exists) {
            response.sendFile(path.resolve('./upload/songs/' + song_file));
        }
        else {
            response.status(200).send({ message: 'song file does not exists' });
        }
    });
}

function getSongAudio(request, response) {
    var song_id = request.params.id;
    Song.findById(song_id, (err, data) => {
        if (err) {
            response.status(500).send({ message: "internal server error getting the songfile" });
        } else {
            if (!data) {
                response.status(404).send({ message: "this song not exists" });

            } else {
                fs.exists('./upload/songs/' + data.file, (exists) => {
                    if (exists) {
                        response.sendFile(path.resolve('./upload/songs/' + data.file));
                    }
                    else {
                        response.status(200).send({ message: 'This song has no audio file' });
                    }
                });
            }
        }
    });
}

module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSongs,
    deleteSong,
    uploadSongFile,
    getSongFile,
    getSongAudio
}