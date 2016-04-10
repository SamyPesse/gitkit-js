var Immutable = require('immutable');
var Q = require('q');
var fs = require('fs');
var path = require('path');

var File = require('../models/file');

function FS(root) {
    if (!(this instanceof FS)) return new FS(root);

    this.root = root;
}

// Absolute path for a file
FS.prototype.path = function(filePath) {
    return path.resolve(this.root, filePath);
};

/*
    Read a directory

    @param {String}
    @return {List<String>}
*/
FS.prototype.readDir = function readDir(dirpath) {
    return Q.nfcall(fs.readdir, this.path(dirpath))
        .then(Immutable.List);
};

/*
    Get details about a file

    @param {String}
    @return {File}
*/
FS.prototype.statFile = function statFile(filePath) {
    return Q.nfcall(fs.stat, this.path(filePath))
        .then(function(stat) {
            return new File({
                path: filePath,
                contentSize: stat.size,
                mode: String(stat.mode),
                type: stat.isDirectory()? File.TYPES.DIRECTORY : File.TYPES.FILE
            });
        });
};

/*
    Read content of a file

    @param {String}
    @return {Buffer}
*/
FS.prototype.read = function read(filePath) {
    return Q.nfcall(fs.readFile, this.path(filePath));
};

/*
    Write content of a file

    @param {String}
    @param {Buffer}
*/
FS.prototype.write = function write(filePath, buf) {
    return Q.nfcall(fs.writeFile, this.path(filePath), buf);
};

/*
    Remove a file

    @param {String}
*/
FS.prototype.unlink = function unlink(filePath) {
    return Q.nfcall(fs.unlink, this.path(filePath));
};

module.exports = FS;
