/** @flow */
/* eslint-disable no-console */

import type Repository from '../models/Repository';

/*
 * Log the list of branches
 */
function logBranches(
    repo: Repository
): Promise<*> {
    return repo.listBranches()
    .then((branches) => {
        branches.forEach(branch => {
            console.log(`  ${branch}`);
        });
    });
}

export default {
    name: 'branch',
    description: 'List, create, or delete branches',
    exec: logBranches,
    options: [],
};
