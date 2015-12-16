var Q = require('q');
var fs = require('fs');
var path = require('path');

function FS(root) {
    if (!(this instanceof FS)) return new FS(root);

    this.root = root;
}

// Absolute path for a file
FS.prototype.path = function(filePath) {
    return path.resolve(this.root, filePath);
};

// Read a file
FS.prototype.read = function read(filePath) {
    return Q.nfcall(fs.readFile, this.path(filePath));
};

// Write a file
FS.prototype.write = function write(filePath, buf) {
    return Q.nfcall(fs.writeFile, this.path(filePath), buf);
};

// Unlink a file
FS.prototype.unlink = function unlink(filePath) {
    return Q.nfcall(fs.unlink, this.path(filePath));
};

module.exports = FS;
