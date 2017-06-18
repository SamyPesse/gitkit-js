/** @flow */

import { Record, List } from 'immutable';
import Author from './Author';

const DEFAULTS: {
    author: Author,
    committer: Author,
    tree: string,
    parents: List,
    message: string,
} = {
    author: new Author(),
    committer: new Author(),
    tree: '',
    parents: new List(),
    message: '',
};

class Commit extends Record(DEFAULTS) {
    static createFromString(content: string): Commit {}

    static createFromBuffer(content: Buffer): Commit {
        return Commit.createFromString(content.toString('utf8'));
    }

    static createFromObject(o: GitObject): Blob {
        return Commit.createFromBuffer(o.content);
    }
}

export default Commit;
