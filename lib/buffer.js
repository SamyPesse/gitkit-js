var Q = require('q');
var zlib = require('zlib');
var Buffer = require('buffer').Buffer;

// Return true if b is an ArrayBuffer
function isArrayBuffer(b) {
    return Object.prototype.toString.call(b) === "[object ArrayBuffer]";
}

// Return true if b is a Buffer object
function isBuffer(b) {
    return Object.prototype.toString.call(b) === "[object Buffer]";
}

// Convert to a buffer
function fromArrayBuffer(ab) {
    var buffer = new Buffer(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }
    return buffer;
}

// Enforce content as a buffer
function enforceBuffer(b) {
    if (isBuffer(b)) return b;
    if (isArrayBuffer(b)) return fromArrayBuffer(b);
    else return new Buffer(b);
}

// Decompress a gzip buffer
function unzip(buf) {
    return Q.nfcall(zlib.unzip, buf);
}

// Compress a buffer
function zip(buf) {
    return Q.nfcall(zlib.deflate, buf);
}

module.exports = {
    enforce: enforceBuffer,
    zip: zip,
    unzip: unzip
};
