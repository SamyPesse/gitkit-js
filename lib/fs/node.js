var Immutable = require('immutable');
var Promise = require('q');
var path = require('path');
var mkdirp = require('mkdirp');
var bindAll = require('bind-all');

var File = require('../models/file');

function FS(fs, root) {
    if (!(this instanceof FS)) {
        return new FS(fs, root);
    }

    this.fs = bindAll(fs);
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
    return Promise.nfcall(this.fs.readdir, this.path(dirpath))
        .then(Immutable.List);
};

/**
 * Get details about a file
 * @param {String}
 * @return {Promise<File>}
 */
FS.prototype.statFile = function statFile(filePath) {
    return Promise.nfcall(this.fs.stat, this.path(filePath))
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
    return Promise.nfcall(this.fs.readFile, this.path(filePath));
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
        return Promise.nfcall(this.fs.writeFile, that.path(filePath), buf);
    });
};

/**
 * Remove a file
 * @param {String}
 * @return {Promise}
 */
FS.prototype.unlink = function unlink(filePath) {
    return Promise.nfcall(this.fs.unlink, this.path(filePath));
};

/**
 * Create a directory
 * @param {String}
 * @return {Promise}
 */
FS.prototype.mkdir = function mkdir(filePath) {
    return Promise.nfcall(mkdirp, this.path(filePath), {
        fs: this.fs
    });
};

module.exports = FS;
