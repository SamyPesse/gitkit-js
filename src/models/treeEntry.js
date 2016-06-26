var Immutable = require('immutable');

import type Sha from './sha';

var TYPES = {
    BLOB: 'blob',
    TREE: 'tree'
};

/*
 * Represents an entry in the git tree.
 */
const defaultRecord: {
    path: string,
    mode: string,
    sha:  Sha
} = {
    path: '',
    mode: '',
    sha: ''
};

class TreeEntry extends Immutable.Record(defaultRecord) {
    getPath() : string {
        return this.get('path');
    }

    getMode() : string {
        return this.get('mode');
    }

    getSha() : Sha {
        return this.get('sha');
    }

    getType() : string {
        return this.getMode() === 16384? TYPES.TREE : TYPES.BLOB;
    }

    isTree() : boolean {
        return this.getType() == 'tree';
    }

    isBlob() : boolean {
        return this.getType() == 'blob';
    }

    /**
     * Create a new tree ntry for a blob
     *
     * @param {String}
     * @return {TreeEntry}
     */
    static createForBlob(filename: string, blobSha: Sha, mode: string) : TreeEntry {
        return new TreeEntry({
            type: TYPES.BLOB,
            path: filename,
            mode: mode || '',
            sha: blobSha
        });
    }
}

module.exports = TreeEntry;
module.exports.TYPES = TYPES;
