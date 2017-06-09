'use strict';

var jwt = require('jwt-simple');
var moment = require('moment');

var secret = 'PUT_THE_SECRET_KEY_HERE';

exports.ensureAuth = (req, res, next) => {
    if(!req.headers.authorization)
        return res.status(403).send({message: 'La peticion no tiene cabecera de autenticación'})
    var token = req.headers.authorization.replace(/['"]+/g, '');
}