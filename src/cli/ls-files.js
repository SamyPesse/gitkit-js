/** @flow */
/* eslint-disable no-console */

import type { Repository } from '../';
import { WorkingIndex } from '../';

/*
 * Log the list of refs in the repository
 */
function lsFiles(repo: Repository): Promise<*> {
    return WorkingIndex.readFromRepository(repo).then(index => {
        index.entries.forEach(file => {
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
