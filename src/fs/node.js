// @flow

var Immutable = require('immutable');
var Promise = require('q');
var path = require('path');
var mkdirp = require('mkdirp');
var bindAll = require('bind-all');

var File = require('../models/file');
var FS = require('./base');

import type {FilePath, FilePaths} from './base';

class NodeFS extends FS {
    fs : any;
    root : string;

    constructor(fs: any, root: string) {
        super();

        this.fs = bindAll(fs);
        this.root = root;
    }


    // Absolute path for a file
    path(filePath: FilePath) : FilePath {
        return path.resolve(this.root, filePath);
    }

    /**
     * Read a directory
     * @param {String}
     * @return {Promise<List<String>>}
     */
    readDir(dirpath: FilePath) {
        return Promise.nfcall(this.fs.readdir, this.path(dirpath))
            .then(Immutable.List);
    }

    /**
     * Get details about a file
     * @param {String}
     * @return {Promise<File>}
     */
    statFile(filePath: FilePath) : Promise<File> {
        return Promise.nfcall(this.fs.stat, this.path(filePath))
            .then(function(stat) {
                return new File({
                    path: filePath,
                    contentSize: stat.size,
                    mode: String(stat.mode),
                    type: stat.isDirectory()? File.TYPES.DIRECTORY : File.TYPES.FILE
                });
            });
    }

    /**
     * Read content of a file
     * @param {String}
     * @return {Promise<Buffer>}
     */
    read(filePath: FilePath) : Promise<Buffer> {
        return Promise.nfcall(this.fs.readFile, this.path(filePath));
    }

    /**
     * Write content of a file
     * @param {String}
     * @param {Buffer}
     * @return {Promise}
     */
    write(filePath: FilePath, buf: Buffer) : Promise {
        var that = this;

        return this.mkdir(path.dirname(filePath))
        .then(function() {
            return Promise.nfcall(that.fs.writeFile, that.path(filePath), buf);
        });
    }

    /**
     * Remove a file
     * @param {String}
     * @return {Promise}
     */
    unlink(filePath: FilePath) : Promise {
        return Promise.nfcall(this.fs.unlink, this.path(filePath));
    }

    /**
     * Create a directory
     * @param {String}
     * @return {Promise}
     */
    mkdir(filePath: FilePath) : Promise {
        if (this.fs.mkdirp) {
            return Promise.nfcall(this.fs.mkdirp, this.path(filePath));
        }

        return Promise.nfcall(mkdirp, this.path(filePath), {
            fs: this.fs
        });
    }
}

module.exports = FS;
