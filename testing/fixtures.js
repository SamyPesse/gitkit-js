var fs = require('fs');
var path = require('path');

/*
    Return path to a fixture

    @param {String}
    @return {String}
*/
function fixturePath(name) {
    return path.resolve(__dirname, 'data', name);
}


/*
    Read a fixture as a stream

    @param {String}
    @return {Stream}
*/
function createReadStream(name) {
    return fs.createReadStream(fixturePath(name));
}

/*
    Read a fixture as a buffer

    @param {String}
    @return {Buffer}
*/
function read(name) {
    return fs.readFileSync(fixturePath(name));
}

module.exports = {
    path: fixturePath,
    read: read,
    createReadStream: createReadStream
};
