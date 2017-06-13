'use strict';

var path = require('path');
var fs = require('fs');
var mongoosePagination = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(request, response) {
    var artist_id = request.params.id;
    Artist.findById(artist_id, (err, data) => {
        if (err) {
            response.status(500).send({ message: "internal server error getting artist" });
        } else if (!data) {
            response.status(200).send({ message: "artist with id <" + artist_id + "> does not exists" });
        } else
            response.status(200).send({ artist: data });
    });
}


function getArtists(request, response) {
    var page = request.params.page ? request.params.page : 1;
    var items_page = 3;
    Artist.find().sort('name').paginate(page, items_page, (err, data, total) => {
        if (err) {
            response.status(500).send({ message: "error getting artists" });
        } else if (data) {
            return response.status(200).send({
                items: total,
                artists: data
            });
        } else {
            response.status(400).send({ message: "there no artists" });
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
            response.status(500).send({ message: "ERROR SAVING ARTIST" });
        }
        else if (data) {
            response.status(200).send({ artist: data });
        } else {
            response.status(500).send({ message: "ARTIST NOT SAVED!!!!!" });
        }
    });
}


function updateArtist(request, response) {
    var artist_id = request.params.id;
    var update = request.body;

    Artist.findByIdAndUpdate(artist_id, update, (err, data) => {
        if (err) {
            response.status(500).send({ message: "ERROR UPDATING ARTIST: ", err });
        } else if (data) {
            return response.status(200).send({ artistUpdated: data });
        } else {
            response.status(500).send({ message: "ARTIST NOT UPDATED!!!!" });
        }
    });
}


function deleteArtist(request, response) {
    var artist_id = request.params.id;
    Artist.findByIdAndRemove(artist_id, (err, artist_removed) => {
        if (err) {
            response.status(500).send({ message: "ERROR REMOVING ARTIST: ", err });
        } else {
            if (!artist_removed) {
                response.status(404).send({ message: "ARTIST NOT REMOVED!!!!" });
            } else {
                Album.find({ artist: artist_removed._id }).remove((err, album_removed) => {
                    if (err) {
                        response.status(500).send({ message: "ERROR REMOVING ALBUM: ", err });
                    } else {
                        if (!album_removed) {
                            response.status(404).send({ message: "ALBUM NOT REMOVED!!!!" });
                        } else {
                            Song.find({ album: album_removed._id }).remove((err, song_removed) => {
                                if (err) {
                                    response.status(500).send({ message: "ERROR REMOVING SONG: ", err });
                                } else if (!song_removed) {
                                    response.status(404).send({ message: "SONG NOT REMOVED!!!!" });
                                } else {
                                    response.status(200).send({ artist_removed, album_removed, song_removed });
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}



function uploadImage(request, response) {
    var artist_id = request.params.id;
    var file_name = 'Not uploaded!!!';
    if (request.files) {
        console.log(request.files.image.path.split('/')[2]);
        file_name = request.files.image.path.split('/')[2];
        var ext = file_name.split('.')[1];
        if (ext == 'jpg' || ext == 'gif'  || ext == 'png') {
            Artist.findByIdAndUpdate(artist_id, { image: file_name }, (err, data) => {
                if (err) {
                    response.status(500).send({ message: "Error updating artist image" });
                }
                if (data) {
                    response.status(200).send({ artist_updated: data });
                }
                else {
                    response.status(404).send({ message: "image not saved" });
                }
            });
        } else {
            response.status(200).send({ message: 'plase, send an image file(".jpg", ".png", ".gif")' });
        }
    } else
        response.status(200).send({ message: 'image file is required' });
}

function getImageFile(request, response) {
    var imageFile = request.params.imageFile;
    fs.exists('./upload/artists/' + imageFile, (exists) => {
        if (exists) {
            response.sendFile(path.resolve('./upload/artists/' + imageFile));
        }
        else {
            response.status(200).send({ message: 'image does not exists' });
        }
    });
}


module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};