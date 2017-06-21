/** @flow */

import path from 'path';
import { Record } from 'immutable';

import sha1 from '../utils/sha1';
import zlib from '../utils/zlib';

import type { SHA } from '../types/SHA';

export type GitObjectType = 'blob' | 'tree' | 'commit';

const DEFAULTS: {
    type: GitObjectType,
    content: Buffer
} = {
    type: 'blob',
    content: new Buffer('')
};

class GitObject extends Record(DEFAULTS) {
    get sha(): SHA {
        return sha1.encode(this.getAsBuffer());
    }

    get length(): number {
        return this.content.length;
    }

    get path(): string {
        return GitObject.getPath(this.sha);
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
            new Buffer(`${type} ${content.length}`, 'utf8'),
            nullBuf,
            content
        ]);
    }

    /*
     * Get path in a git repository for an object.
     */
    static getPath(sha: string): string {
        return path.join('objects', sha.slice(0, 2), sha.slice(2));
    }

    /*
     * Create a git object from a buffer (dezipped).
     */
    static createFromBuffer(buffer: Buffer): GitObject {
        const nullChar = buffer.indexOf(0);

        // Parse object header
        const header = buffer.slice(0, nullChar).toString();
        const type = header.split(' ')[0];

        // Extract content
        const content = buffer.slice(nullChar + 1);

        return new GitObject({
            type,
            content
        });
    }

    /*
     * The Git object is zipped on the disk.
     */
    static createFromZip(buffer: Buffer): GitObject {
        return GitObject.createFromBuffer(zlib.unzip(buffer));
    }
}

/*
 * An interface for class which are serializable as Git objects.
 */
export interface GitObjectSerializable<T> {
    static createFromObject(o: GitObject): T,
    toGitObject(): GitObject
}

export default GitObject;
