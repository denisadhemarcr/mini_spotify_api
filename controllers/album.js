'use strict';

var path = require('path');
var fs = require('fs');
var mongoosePagination = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(request, response) {

    response.status(200).send({ message: "album works!!!" });
    /*
    var album_id = request.params.id;
    Album.findById(album_id, (err, data) => {
        if (err) {
            response.status(500).send({ message: "internal server error getting album" });
        } else if (!data) {
            response.status(200).send({ message: "album with id <" + album_id + "> does not exists" });
        } else
            response.status(200).send({ album: data });
    });
    */
}

module.exports = {
    getAlbum
};