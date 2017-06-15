'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//load routes
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//config headers

//base routes

app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);

module.exports = app;