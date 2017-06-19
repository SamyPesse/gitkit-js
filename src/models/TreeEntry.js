/** @flow */

import { Record } from 'immutable';

type TreeEntryType = 'blob' | 'tree';

const DEFAULTS: {
    path: string,
    mode: number,
    sha: string,
} = {
    path: '',
    mode: 0,
    sha: '',
};

class TreeEntry extends Record(DEFAULTS) {
    get type(): TreeEntryType {
        if (this.isTree) {
            return 'tree';
        } else {
            return 'blob';
        }
    }

    get isTree(): boolean {
        return this.mode == 40000;
    }
}

export default TreeEntry;
