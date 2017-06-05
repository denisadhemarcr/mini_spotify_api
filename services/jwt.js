'use strict';

var jwt = require('jwt-simple');
var moment = require('moment');

var secret = 'PUT_THE_SECRET_KEY_HERE';

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        rome: user.role,
        image: user.image,
        ini: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };
    return jwt.encode(payload, secret);
};