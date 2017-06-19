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

    var find = album_id ? Song.find({ album: album_id }).sort('number') :
        Song.find({}).sort('number');
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
                response.status(404).send({ message: 'song not saved' });
            }
        }
    });
}

module.exports = {
    getSong,
    saveSong,
    getSongs
}