var Immutable = require('immutable');
var File = require('./file');
var Blob = require('./blob');

var TYPES = {
    MODIFIED:   'modified',
    CREATED:    'created',
    REMOVED:    'removed',
    UNTRACKED:  'untracked'
};

var Change = Immutable.Record({
    file:       File(),
    type:       String(TYPES.MODIFIED),
    blob:       Blob()
});

Change.prototype.getFile = function() {
    return this.get('file');
};

Change.prototype.getBlob = function() {
    return this.get('blob');
};

Change.prototype.getType = function() {
    return this.get('type');
};

Change.prototype.isTracked = function() {
    return this.getType() !== TYPES.UNTRACKED;
};

/*
    Create a new change from a file and a type

    @param {String} type
    @parsm {File} file
    @return {Change}
*/
Change.createForFile = function(type, file) {
    return new Change({
        type: type,
        file: file
    });
};

module.exports = Change;
module.exports.TYPES = TYPES;
