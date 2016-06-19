var Immutable = require('immutable');
var Promise = require('q');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

var File = require('../models/file');

function FS(root) {
    if (!(this instanceof FS)) return new FS(root);

    this.root = root;
}

// Absolute path for a file
FS.prototype.path = function(filePath) {
    return path.resolve(this.root, filePath);
};

/**
 * Read a directory
 * @param {String}
 * @return {Promise<List<String>>}
 */
FS.prototype.readDir = function readDir(dirpath) {
    return Promise.nfcall(fs.readdir, this.path(dirpath))
        .then(Immutable.List);
};

/**
 * Get details about a file
 * @param {String}
 * @return {Promise<File>}
 */
FS.prototype.statFile = function statFile(filePath) {
    return Promise.nfcall(fs.stat, this.path(filePath))
        .then(function(stat) {
            return new File({
                path: filePath,
                contentSize: stat.size,
                mode: String(stat.mode),
                type: stat.isDirectory()? File.TYPES.DIRECTORY : File.TYPES.FILE
            });
        });
};

/**
 * Read content of a file
 * @param {String}
 * @return {Promise<Buffer>}
 */
FS.prototype.read = function read(filePath) {
    return Promise.nfcall(fs.readFile, this.path(filePath));
};

/**
 * Write content of a file
 * @param {String}
 * @param {Buffer}
 * @return {Promise}
 */
FS.prototype.write = function write(filePath, buf) {
    var that = this;

    return this.mkdir(path.dirname(filePath))
    .then(function() {
        return Promise.nfcall(fs.writeFile, that.path(filePath), buf);
    });
};

/**
 * Remove a file
 * @param {String}
 * @return {Promise}
 */
FS.prototype.unlink = function unlink(filePath) {
    return Promise.nfcall(fs.unlink, this.path(filePath));
};

/**
 * Create a directory
 * @param {String}
 * @return {Promise}
 */
FS.prototype.mkdir = function mkdir(filePath) {
    return Promise.nfcall(mkdirp, this.path(filePath));
};

module.exports = FS;
