/** @flow */

import { Record } from 'immutable';

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
    get isTree(): boolean {
        return this.mode == 16384;
    }
}

export default TreeEntry;
