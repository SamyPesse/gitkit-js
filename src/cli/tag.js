/** @flow */
/* eslint-disable no-console */

import type { Repository } from '../';
import { RefsIndex } from '../';

/*
 * Log the list of branches.
 */
function logTags(repo: Repository): Promise<*> {
    return RefsIndex.readFromRepository(repo).then(({ tags }) => {
        tags.forEach((ref, tagName) => {
            console.log(`${tagName}`);
        });
    });
}

export default {
    name: 'tag',
    description: 'Create, list, delete tags',
    exec: logTags,
    options: []
};
