'use strict';
var bcrypt = require('bcrypt-nodejs');

var User = require('../models/user');

function test(req, res) {
    res.status(200).send({
        message: 'testing one action of the user controller'
    });
}

function saveUser(req, res) {
    var user = new User();
    var params = req.body;

    console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    if (params.password) {
        bcrypt.hash(params.password, null, null, (err, hash) => {
            user.password = hash;
            if (user.password && user.name && user.surname) {
                user.save((err, userStored) => {
                    if (err) res.status(500).send({ message: 'error saving user: ', error: err });
                    res.status(200).send({ user: userStored });
                });
            } else res.status(200).send({ message: 'invalid request, missing parameters' });
        });
    } else res.status(500).send({ message: 'missing param <password> in request' });
}

module.exports = {
    test,
    saveUser
};