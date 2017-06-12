'use strict';

var jwt = require('jwt-simple');
var moment = require('moment');

var secret_key = 'PUT_THE_SECRET_KEY_HERE';

exports.ensureAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: '"authentication" header missing' })
    }
    var token = req.headers.authorization.replace(/['"]+/g, '');
    try {
        var payload = jwt.decode(token, secret_key);
        if (payload.exp < moment().unix()) {
            return res.status(401).send({ message: "Session expired, please log in again" });
        }
    } catch (error) {
        return res.status(401).send({ message: "Invalid jwt token authentication" });
    }
    req.user = payload;
    next();
}