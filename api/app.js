'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//load routes
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');
var song_routes = require('./routes/song');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//config http headers
app.use((request, response, next)=>{
    request.header('Access-Control-Allow-Origin', '*');
    request.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-Width, Content-Type, Access-Control-Allow-Request-Method');
    request.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    request.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//base routes

app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);

module.exports = app;