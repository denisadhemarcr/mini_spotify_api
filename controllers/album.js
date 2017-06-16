'use strict';

var path = require('path');
var fs = require('fs');
var mongoosePagination = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(request, response) {
    var album_id = request.params.id;
    Album.findById(album_id).populate({ path: 'artist' }).exec((err, data) => {
        if (err) {
            response.status(500).send({ message: "internal server error getting album" });
        } else if (!data) {
            response.status(200).send({ message: "album with id <" + album_id + "> does not exists" });
        } else
            response.status(200).send({ album: data });
    });
}


function getAlbums(request, response) {
    var artist_id = request.params.artist;
    if (artist_id) {
        //get albums of some artist
        var find = Album.find({ artist: artist_id }).sort('year');
    } else {
        //get all albums
        var find = Album.find({}).sort('title');
    }
    find.populate({ path: 'artist' }).exec((err, data) => {
        if (err) {
            response.status(500).send({ message: "Internal server error getting albums" });
        } else {
            if (!data) {
                response.status(404).send({ message: "no albums found" });
            } else {
                response.status(200).send({ albums: data });
            }
        }
    });
}


function updateAlbum(request, response) {
    var album_id = request.params.id;
    var update = request.body;

    Album.findByIdAndUpdate(album_id, update, (err, data) => {
        if (err) {
            response.status(500).send({ message: "Internal server error updating albums" });
        } else {
            if (!data) {
                response.status(404).send({ message: "album not updated" });
            } else {
                response.status(200).send({ album_updated: data });
            }
        }
    });
}


function saveAlbum(request, response) {
    var album = new Album();
    var params = request.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err, data) => {
        if (err) {
            response.status(500).send({ message: "Error saving album" });
        } else {
            if (!data) {
                response.status(404).send({ message: "Album not saved" });
            } else {
                response.status(200).send({ album: data });
            }
        }
    });
}

module.exports = {
    getAlbum,
    getAlbums,
    saveAlbum,
    updateAlbum
};