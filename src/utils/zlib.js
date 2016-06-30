// @flow

var pako = require('pako');
var uint8ToBuffer = require('typedarray-to-buffer');
var bufferToUint8 = require('buffer-to-uint8array');

/**
 * Decompress a gzip buffer
 * @param {Buffer}
 * @return {Buffer}
 */
function unzip(buf: Buffer) : Buffer {
    var input = bufferToUint8(buf);
    var output = pako.inflate(input);

    return uint8ToBuffer(output);
}

/**
 * Compress a buffer
 * @param {Buffer}
 * @return {Buffer}
 */
function zip(buf: Buffer) : Buffer {
    var input = bufferToUint8(buf);
    var output = pako.deflate(input);

    return uint8ToBuffer(output);
}

module.exports = {
    zip: zip,
    unzip: unzip
};