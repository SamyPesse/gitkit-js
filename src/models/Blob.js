/** @flow */

import { Record } from 'immutable';
import { Buffer } from 'buffer';
import GitObject from './GitObject';

const DEFAULTS: {
    content: Buffer,
} = {
    content: new Buffer(''),
};

class Blob extends Record(DEFAULTS) {
    toGitObject(): GitObject {
        return new GitObject({
            type: 'buffer',
            content: this.content,
        });
    }

    /*
     * Create a blob from a git object.
     */
    static createFromObject(o: GitObject): Blob {
        return new GitObject({
            content: o.content,
        });
    }
}

export default Blob;
