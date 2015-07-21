var crypto = require('crypto'),
    fs = require('fs');

configCredentials = function (username, password, directory) {
    var fileName = './config/config.json';
    var content = {};
    var encryptedPassword = encrypt(password);

    content.username = username;
    content.password = encryptedPassword;
    content.path = directory;
    console.log(encryptedPassword);
    fs.writeFileSync(fileName, JSON.stringify(content));
};


var encrypt = function (text) {
    var cipher = crypto.createCipher('aes-256-cbc','d6F3Efeq')
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
};

var decrypt = function (text) {
    console.log(text);
    var decipher = crypto.createDecipher('aes-256-cbc','d6F3Efeq')
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
};

module.exports = {
    configCredentials:configCredentials,
    decryptPassword:decrypt
};