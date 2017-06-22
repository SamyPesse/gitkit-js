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
        return new Blob({
            content: o.content
        });
    }

    /*
     * Create a blob from a buffer.
     */
    static createFromBuffer(content: Buffer): Blob {
        return new Blob({
            content
        });
    }

    /*
     * Create a blob from a string.
     */
    static createFromString(content: string): Blob {
        return Blob.createFromBuffer(new Buffer(content, 'utf8'));
    }
}

export default Blob;
