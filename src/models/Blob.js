/** @flow */

import { Record } from 'immutable';
import GitObject from './GitObject';

import type { GitObjectSerializable } from './GitObject';

const DEFAULTS: {
    content: Buffer
} = {
    content: new Buffer('')
};

class Blob extends Record(DEFAULTS) implements GitObjectSerializable<Blob> {
    toGitObject(): GitObject {
        return new GitObject({
            type: 'buffer',
            content: this.content
        });
    }

    /*
     * Create a blob from a git object.
     */
    static createFromObject(o: GitObject): Blob {
        return new GitObject({
            content: o.content
        });
    }
}

export default Blob;
