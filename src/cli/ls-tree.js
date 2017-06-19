/** @flow */
/* eslint-disable no-console */

import type Repository from '../models/Repository';

/*
 * List all files in the repository.
 */
function lsTree(repo: Repository, args: string[]): Promise<*> {
    return repo.walkTree(args[0], (filepath, entry) => {
        console.log(`${entry.mode} ${entry.type} ${entry.sha} ${filepath}`);
    });
}

export default {
    name: 'ls-tree',
    exec: lsTree,
};
