'use strict';
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

function test(request, response) {
    response.status(200).send({
        message: 'testing one action of the user controller'
    });
}

function saveUser(request, response) {
    var user = new User();
    var params = request.body;
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_ADMIN';
    user.image = 'null';

    if (params.password) {
        bcrypt.hash(params.password, null, null, (err, hash) => {
            user.password = hash;
            if (user.password && user.name && user.surname) {
                user.save((err, userStored) => {
                    if (err) {
                        response.status(500).send({ message: 'error saving user: ', error: err });
                    } else {
                        response.status(200).send({ user: userStored });
                    }
                });
            } else {
                response.status(200).send({ message: 'invalid request, missing parameters' });
            };
        });
    } else {
        response.status(500).send({ message: 'missing param <password> in request' })
    };
}


function loginUser(request, response) {
    var params = request.body;
    var email = params.email;
    var password = params.password;
    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err)
            return response.status(500).send({ message: 'Internal server error 1' });
        if (!user)
            return response.status('404').send({ message: 'User whit email "' + email + '" not found' });
        bcrypt.compare(password, user.password, (err, check) => {
            if (check) {
                if (params.gethash)
                    return response.status(200).send({ token: jwt.createToken(user) });
                return response.status(200).send({ user });
            }
            return response.status(500).send({ message: 'Internal server error 2' });
        });
    });
}


function updateUser(request, response) {
    var userId = request.params.id;
    var update = request.body;

    User.findByIdAndUpdate(userId, update, (err, data) => {
        if (err) {
            return response.status(500).send({ message: "Error updating user info" });
        }
        if (data) {
            return response.status(200).send({ user: data });
        }
        return response.status(404).send({ message: "user not saved" });
    });
}


function uploadImage(request, response) {
    var userId = request.params.id;
    var file_name = 'Not uploaded!!!';
    if (request.files) {
        file_name = request.files.image.path.split('/')[2];
        var ext = file_name.split('.')[1];
        if (ext == ('png' || 'jpg' || 'gif')) {
            User.findByIdAndUpdate(userId, { image: file_name }, (err, data) => {
                if (err) {
                    response.status(500).send({ message: "Error updating user image" });
                }
                if (data) {
                    response.status(200).send({ message: data });
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
    fs.exists('./upload/users/' + imageFile, (exists) => {
        if (exists) {
            response.sendFile(path.resolve('./upload/users/' + imageFile));
        }
        else {
            response.status(200).send({ message: 'image does not exists' });
        }
    });
}



module.exports = {
    test,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};