var Immutable = require('immutable');

var TYPES = {
    BLOB: 'blob',
    TREE: 'tree'
};

/*
    Represents an entry in the git tree.
*/
var TreeEntry = Immutable.Record({
    path: String(),
    mode: String(),
    sha: String()
});

TreeEntry.prototype.getPath = function() {
    return this.get('path');
};

TreeEntry.prototype.getMode = function() {
    return this.get('mode');
};

TreeEntry.prototype.getSha = function() {
    return this.get('sha');
};

TreeEntry.prototype.getType = function() {
    return this.getMode() === 16384? TYPES.TREE : TYPES.BLOB;
};

TreeEntry.prototype.isTree = function() {
    return this.getType() == 'tree';
};

TreeEntry.prototype.isBlob = function() {
    return this.getType() == 'blob';
};

/**
 * Create a new tree ntry for a blob
 *
 * @param {String}
 * @return {TreeEntry}
 */
TreeEntry.createForBlob = function(filename, blobSha, mode) {
    return new TreeEntry({
        type: TYPES.BLOB,
        path: filename,
        mode: mode || '',
        sha: blobSha
    });
};

module.exports = TreeEntry;
module.exports.TYPES = TYPES;
