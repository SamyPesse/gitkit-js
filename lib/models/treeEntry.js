var Immutable = require('immutable');

/*
    Represents an entry in the git tree.
*/
var TreeEntry = Immutable.Record({
    path: String(),
    mode: String(),
    sha: String(),
    type: String()
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
    return this.get('type');
};

module.exports = TreeEntry;
