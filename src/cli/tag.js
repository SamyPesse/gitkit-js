/** @flow */
/* eslint-disable no-console */

import type GitKit from '../';

/*
 * Log the list of branches.
 */
function logTags(gitkit: GitKit): Promise<*> {
    return gitkit.indexRefs().then(() => {
        const { refs } = gitkit.repo;

        refs.tags.forEach((ref, tagName) => {
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
