/** @flow */
/* eslint-disable no-console */

import type GitKit from '../';

/*
 * Log the list of branches.
 */
function logBranches(gitkit: GitKit): Promise<*> {
    return gitkit.readHEAD().then(() => gitkit.indexRefs()).then(() => {
        const { head } = gitkit.repo;
        const { branches } = gitkit.repo.refs;

        branches.forEach((ref, branchName) => {
            console.log(
                `${head.isPointingToBranch(branchName)
                    ? '*'
                    : ' '} ${branchName}`
            );
        });
    });
}

export default {
    name: 'branch',
    description: 'List, create, or delete branches',
    exec: logBranches,
    options: []
};
