'use strict';

var express = require('express');
var SongController = require('../controllers/song');
var api = express.Router();

var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './upload/songs' });

api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.get('/songs/:album?', md_auth.ensureAuth, SongController.getSongs);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);
api.put('/song/:id', md_auth.ensureAuth, SongController.updateSongs);
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong);
api.post('/upload-file-song/:id', [md_auth.ensureAuth, md_upload], SongController.uploadSongFile );
api.get('/get-song-file/:file', SongController.getSongFile);
api.get('/get-song-audio/:id', SongController.getSongAudio);


module.exports = api;