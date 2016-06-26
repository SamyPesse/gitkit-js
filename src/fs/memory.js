// @flow

var MemoryFileSystem = require('memory-fs');
var NodeFS = require('./node');

/**
 * Create a in-memory filesystem that can be used in both Node.js and the browser
 */
class MemoryFS extends NodeFS {
    constructor() {
        var fs = new MemoryFileSystem();
        super(fs, '/')
    }
}

module.exports = MemoryFS;
