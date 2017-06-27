'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var SongSchema = schema({
    number: Number,
    name: String,
    duration: Number,
    file: String,
    album: { type: schema.ObjectId, ref: 'Album' }
});

module.exports = mongoose.model('Song', SongSchema);