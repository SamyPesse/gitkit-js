/** @flow */

import { Record, List } from 'immutable';
import Author from './Author';

import type GitObject, { GitObjectSerializable } from './GitObject';
import type { SHA } from '../types/SHA';

const DEFAULTS: {
    author: Author,
    committer: Author,
    tree: SHA,
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
    static createFromString(content: string): Commit {
        const lines = content.split('\n');

        const separator = lines.findIndex(line => !line.trim());
        const metaLines = lines.slice(0, separator);

        const meta = metaLines.reduce((accu, line) => {
            const match = line.match(/(\S+)\s(.*)/);

            if (!match) {
                return accu;
            }

            const key = match[1];
            const value = match[2];

            accu[key] = (accu[key] || []).concat([value]);

            return accu;
        }, {});

        // Extract message
        const messageLines = lines.slice(separator + 1, -1);
        const message = messageLines.join('\n');

        return new Commit({
            message,
            tree: meta.tree[0],
            parents: List(meta.parent),
            author: Author.createFromString(meta.author),
            committer: Author.createFromString(meta.committer),
        });
    }

    static createFromBuffer(content: Buffer): Commit {
        return Commit.createFromString(content.toString('utf8'));
    }

    static createFromObject(o: GitObject): Commit {
        return Commit.createFromBuffer(o.content);
    }
}

export default Commit;
