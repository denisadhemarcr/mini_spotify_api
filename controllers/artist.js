'use strict';

var path = require('path');
var fs = require('fs');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(request, response) {
    var artist_id = request.params.id;
    Artist.findById(artist_id, (err, data) => {
        if (err) {
            response.status(500).send({ message: "internal server error getting artist" });
        } else {
            if (!data) {
                response.status(200).send({ message: "artist with id <" + artist_id + "> does not exists" });
            } else
                response.status(200).send({ artist: data });
        }
    });
}

function saveArtist(request, response) {
    var artist = new Artist();
    var params = request.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, data) => {
        if (err) {
            response.status(500).send({ message: "error al guardar artista" });
        }
        else {
            response.status(200).send({ artist: data });
        }
    });
}


module.exports = {
    getArtist,
    saveArtist
};