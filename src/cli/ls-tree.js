/** @flow */
/* eslint-disable no-console */

import type Repository from '../models/Repository';
import type TreeEntry from '../models/TreeEntry';

type Kwargs = {
    recursive: boolean
};

/*
 * Print a tree entry.
 */
function printEntry(entry: TreeEntry, filepath: string) {
    console.log(`${entry.mode} ${entry.type} ${entry.sha} ${filepath}`);
}

/*
 * List all files in the repository.
 */
function lsTree(
    repo: Repository,
    [sha]: string[],
    { recursive }: Kwargs
): Promise<*> {
    if (recursive) {
        return repo.walkTree(sha, printEntry);
    }
    return repo.readTree(sha).then(tree => {
        tree.entries.forEach(printEntry);
    });
}

export default {
    name: 'ls-tree [sha]',
    description: 'List the contents of a tree object',
    exec: lsTree,
    options: [
        {
            type: 'boolean',
            name: 'recursive',
            shortcut: 'r',
            description: 'Recurse into sub-trees.',
            default: false
        }
    ]
};
