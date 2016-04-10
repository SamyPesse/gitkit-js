var Immutable = require('immutable');

var TYPES = {
    DIRECTORY: 'dir',
    FILE: 'file'
};

var File = Immutable.Record({
    path: String(),
    type: String(TYPES.FILE),
    mode: String(),
    contentSize: Number()
});

File.prototype.getPath = function() {
    return this.get('path');
};

File.prototype.getType = function() {
    return this.get('type');
};

File.prototype.getMode = function() {
    return this.get('mode');
};

File.prototype.getContentSize = function() {
    return this.get('contentSize');
};

File.prototype.isDirectory = function() {
    return this.getType() === TYPES.DIRECTORY;
};

/*
    Create a file from a IndexEntry

    @param {IndexEntry}
    @return {File}
*/
File.createFromIndexEntry = function(entry) {
    return new File({
        path: entry.getPath(),
        mode: entry.getMode(),
        contentSize: entry.getEntrySize()
    });
};


module.exports = File;
module.exports.TYPES = TYPES;
