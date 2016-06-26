var MemoryFileSystem = require('memory-fs');
var NodeFS = require('./node');

/**
 * Create a in-mmeory filesystem that can be used in both Node.js and the browser
 */
function MemoryFS() {
    var fs = new MemoryFileSystem();
    return new NodeFS(fs, '/');
};

module.exports = MemoryFS;
