'use strict';

var path = require('path');
var fs = require('fs');
var mongoosePagination = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(request, response) {
    response.status(200).send({ message: "song works!!!" });
}

function saveSong(request, response) {
    var song = new Song();
    var params = request.body;
    song.number = params.number;
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
                response.status(200).send({ message: 'song not saved' });
            }
        }
    });
}

module.exports = {
    getSong,
    saveSong
}