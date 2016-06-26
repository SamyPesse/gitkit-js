// @flow

var Immutable = require('immutable');

import type IndexEntry from './indexEntry';

var TYPES = {
    DIRECTORY: 'dir',
    FILE: 'file'
};

var defaultRecord: {
    path:        string,
    type:        string,
    mode:        string,
    contentSize: number
} = {
    path:        '',
    type:        TYPES.FILE,
    mode:        '',
    contentSize: 0
};

class File extends Immutable.Record(defaultRecord) {
    getPath() : string {
        return this.get('path');
    }

    getType() : string {
        return this.get('type');
    }

    getMode() : string {
        return this.get('mode');
    }

    getContentSize() : number {
        return this.get('contentSize');
    }

    isDirectory() : boolean {
        return this.getType() === TYPES.DIRECTORY;
    }

    /**
     * Create a file from an index entry
     *
     * @param {IndexEntry}
     * @return {File}
     */
    static createFromIndexEntry(entry: IndexEntry) : File {
        return new File({
            path: entry.getPath(),
            mode: entry.getMode(),
            contentSize: entry.getEntrySize()
        });
    }
}

module.exports = File;
module.exports.TYPES = TYPES;
