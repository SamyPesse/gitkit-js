/** @flow */
/* eslint-disable no-console */

import type Repository from '../models/Repository';
import { Ref, RefsIndex } from '../';

/*
 * Log the list of branches.
 */
function logBranches(repo: Repository): Promise<*> {
    return Promise.all([
        Ref.readHEADFromRepository(repo),
        RefsIndex.readFromRepository(repo)
    ]).then(([head, { branches }]) => {
        branches.forEach((ref, branchName) => {
            console.log(
                `${head.pointToBranch(branchName) ? '*' : ' '} ${branchName}`
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
