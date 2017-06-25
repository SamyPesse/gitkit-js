/** @flow */
/* eslint-disable no-console */

import { Blob, Commit, Tree } from '../';
import type { Repository } from '../';

type Kwargs = {
    pretty: boolean,
    size: boolean,
    type: boolean
};

function prettyBlob(blob: Blob) {
    console.log(blob.content.toString('utf8'));
}

function prettyCommit(commit: Commit) {
    console.log(`tree ${commit.tree}`);
    commit.parents.forEach(parent => console.log(`parent ${parent}`));
    console.log(`author ${commit.author}`);
    console.log(`committer ${commit.committer}`);
    console.log(`\n${commit.message}`);
}

function prettyTree(tree: Tree) {
    tree.entries.forEach((entry, filepath) =>
        console.log(`${entry.mode}\t${entry.type}\t${entry.sha}\t${filepath}`)
    );
}

/*
 * Print an object from the database.
 */
function catFile(
    repo: Repository,
    [sha]: string[],
    { pretty, type, size }: Kwargs
): Promise<*> {
    if (!sha) {
        throw new Error('Missing argument "sha"');
    }

    return repo
        .indexObjects()
        .then(_repo => _repo.readObject(sha))
        .then(_repo => {
            const object = _repo.objects.getObject(sha);

            if (type) {
                console.log(object.type);
            } else if (size) {
                console.log(object.length);
            } else if (pretty) {
                if (object.isBlob) {
                    prettyBlob(Blob.createFromObject(object));
                } else if (object.isCommit) {
                    prettyCommit(Commit.createFromObject(object));
                } else if (object.isTree) {
                    prettyTree(Tree.createFromObject(object));
                }
            }
        });
}

export default {
    name: 'cat-file [sha]',
    description:
        'Provide content or type and size information for repository objects',
    exec: catFile,
    options: [
        {
            type: 'boolean',
            name: 'pretty',
            shortcut: 'p',
            description: "pretty-print object's content",
            default: true
        },
        {
            type: 'boolean',
            name: 'type',
            shortcut: 't',
            description: 'show object type',
            default: false
        },
        {
            type: 'boolean',
            name: 'size',
            shortcut: 's',
            description: 'show object size',
            default: false
        }
    ]
};
