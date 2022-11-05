var crypto = require('crypto');
const { hashKeyAdmin,emailKey,passKey } = require('../constants/keys')

const encryptAdmin = (pass) => {
    var mykey = crypto.createCipher('aes-128-cbc', hashKeyAdmin);
    var mystr = mykey.update(pass, 'hex', 'utf8')
    mystr += mykey.final('utf8');
    return mystr
}

const encryptEmail = (pass) => {
    var mykey = crypto.createCipher('aes-128-cbc', emailKey);
    var newEmail = mykey.update(pass, 'utf8', 'hex')
    newEmail += mykey.final('hex');
    return newEmail
}

const encryptPass = (pass) => {
    var myPasskey = crypto.createCipher('aes-128-cbc', passKey);
    var newPassword = myPasskey.update(pass, 'utf8', 'hex')
    newPassword += myPasskey.final('hex');
    return newPassword
}

module.exports={
    encryptAdmin,
    encryptEmail,
    encryptPass
}