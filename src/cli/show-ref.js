/** @flow */
/* eslint-disable no-console */

import type Repository from '../models/Repository';

/*
 * Log the list of refs in the repository
 */
function showRef(repo: Repository): Promise<*> {
    return repo.indexRefs().then(_repo => {
        const { refs } = _repo;

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
