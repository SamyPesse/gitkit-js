/** @flow */
/* eslint-disable no-console */

import type Repository from '../models/Repository';
import { RefsIndex } from '../';

/*
 * Log the list of branches.
 */
function logBranches(
    repo: Repository
): Promise<*> {
    return RefsIndex.readFromRepository(repo)
    .then(({ branches }) => {
        branches.forEach((ref, branchName) => {
            console.log(`  ${branchName}`)
        });
    });
}

export default {
    name: 'branch',
    description: 'List, create, or delete branches',
    exec: logBranches,
    options: [],
};
