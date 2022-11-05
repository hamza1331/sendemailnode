var crypto = require('crypto');
const { hashKeyAdmin,emailKey,passKey } = require('../constants/keys')

const decryptAdmin = (pass) => {
    var mykey = crypto.createDecipher('aes-128-cbc', hashKeyAdmin);
    var mystr = mykey.update(pass, 'hex', 'utf8')
    mystr += mykey.final('utf8');
    return mystr
}

const decryptEmail = (pass) => {
    var mykey = crypto.createDecipher('aes-128-cbc', emailKey);
    var mystr = mykey.update(pass, 'hex', 'utf8')
    mystr += mykey.final('utf8');
    return mystr
}

const decryptPass = (pass) => {
    var mykey = crypto.createDecipher('aes-128-cbc', passKey);
    var mystr = mykey.update(pass, 'hex', 'utf8')
    mystr += mykey.final('utf8');
    return mystr
}

module.exports={
    decryptAdmin,
    decryptEmail,
    decryptPass
}