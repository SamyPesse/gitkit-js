/** @flow */

import { Record, List } from 'immutable';
import Author from './Author';

import type GitObject, { GitObjectSerializable } from './GitObject';

const DEFAULTS: {
    author: Author,
    committer: Author,
    tree: string,
    parents: List<string>,
    message: string,
} = {
    author: new Author(),
    committer: new Author(),
    tree: '',
    parents: new List(),
    message: '',
};

class Commit extends Record(DEFAULTS) implements GitObjectSerializable<Commit> {
    static createFromString(content: string): Commit {}

    static createFromBuffer(content: Buffer): Commit {
        return Commit.createFromString(content.toString('utf8'));
    }

    static createFromObject(o: GitObject): Blob {
        return Commit.createFromBuffer(o.content);
    }
}

export default Commit;
