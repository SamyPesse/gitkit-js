/** @flow */

import { Record } from 'immutable';
import sha1 from '../utils/sha1';

export type GitObjectType = 'blob' | 'tree' | 'commit';

const DEFAULTS: {
    type: GitObjectType,
    content: Buffer,
} = {
    type: 'blob',
    content: new Buffer(''),
};

class GitObject extends Record(DEFAULTS) {
    get sha(): string {
        return sha1.encode(this.getAsBuffer());
    }

    get isTree(): boolean {
        return this.type == 'tree';
    }

    get isBlob(): boolean {
        return this.type == 'blob';
    }

    get isCommit(): boolean {
        return this.type == 'commit';
    }

    /*
     * Get entire buffer to represent this object.
     */
    getAsBuffer(): Buffer {
        const { type, content } = this;

        const nullBuf = new Buffer(1);
        nullBuf.fill(0);

        return Buffer.concat([
            new Buffer(type + ' ' + content.length, 'utf8'),
            nullBuf,
            content,
        ]);
    }
}

export default GitObject;
