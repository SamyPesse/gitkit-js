var crypto = require('crypto');

/*
    Validates a SHA in hexadecimal

    @param {String},
    @return {Boolean}
*/
function validateSha(str) {
    return (/[0-9a-f]{40}/).test(str);
}

/*
    Encode content as sha

    @param {String|Buffer} s
    @return {String}
*/
function encode(s) {
    var shasum = crypto.createHash('sha1');
    shasum.update(s);
    return shasum.digest('hex');
}

module.exports = {
    is: validateSha,
    encode: encode
};
