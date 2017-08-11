/** @flow */
/* eslint-disable no-console */

import type GitKit from '../';

/*
 * Log the list of refs in the repository
 */
function lsFiles(gitkit: GitKit): Promise<*> {
    return gitkit.readWorkingIndex().then(() => {
        const { workingIndex } = gitkit.repo;

        workingIndex.entries.forEach(file => {
            console.log(`${file.path}`);
        });
    });
}

export default {
    name: 'ls-files',
    description:
        'Show information about files in the index and the working tree',
    exec: lsFiles,
    options: []
};
