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

// Convert Uint8Array to a buffer
function fromUint8Array(view) {
    var buffer = new Buffer(view.length);
    for (var i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }
    return buffer;
}

// Convert to a buffer
function fromArrayBuffer(ab) {
    return fromUint8Array(new Uint8Array(ab));
}

// Convert a buffer to ArrayBuffer
function toArrayBuffer(buffer) {
    var ab = new ArrayBuffer(buffer.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return ab;
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
    unzip: unzip,
    fromUint8Array: fromUint8Array,
    toArrayBuffer: toArrayBuffer
};
