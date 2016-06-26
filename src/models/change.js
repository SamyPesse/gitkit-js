// @flow

var Immutable = require('immutable');
var File = require('./file');
var Blob = require('./blob');

var TYPES = {
    MODIFIED:   'modified',
    CREATED:    'created',
    REMOVED:    'removed',
    UNTRACKED:  'untracked'
};

var defaultRecord: {
    file: File,
    type: string,
    blob: Blob
} = {
    file: new File(),
    type: TYPES.MODIFIED,
    blob: new Blob()
};

class Change extends Immutable.Record(defaultRecord) {
    getFile() : File {
        return this.get('file');
    }

    getBlob() : Blob {
        return this.get('blob');
    }

    getType() : string {
        return this.get('type');
    }

    isTracked() : boolean {
        return this.getType() !== TYPES.UNTRACKED;
    }

    /**
     * Create a new change from a file and a type
     *
     * @param {String} type
     * @parsm {File} file
     * @return {Change}
     */
    static createForFile(type: string, file: File) : Change {
        return new Change({
            type: type,
            file: file
        });
    }

    static get TYPES() {
        return TYPES;
    }
}

module.exports = Change;
