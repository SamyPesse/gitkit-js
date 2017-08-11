/** @flow */
/* eslint-disable no-console */

import type GitKit from '../';

/*
 * Log the list of refs in the repository
 */
function showRef(gitkit: GitKit): Promise<*> {
    return gitkit.indexRefs().then(() => {
        const { refs } = gitkit.repo;

        refs.refs.forEach((ref, refName) => {
            console.log(`${ref.commit || ref.ref}  ${refName}`);
        });
    });
}

export default {
    name: 'show-ref',
    description: 'List references in a local repository',
    exec: showRef,
    options: []
};
