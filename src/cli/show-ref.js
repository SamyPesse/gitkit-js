/** @flow */
/* eslint-disable no-console */

import type Repository from '../models/Repository';
import { RefsIndex } from '../';

/*
 * Log the list of refs in the repository
 */
function showRef(repo: Repository): Promise<*> {
    return RefsIndex.readFromRepository(repo).then(index => {
        index.refs.forEach((ref, refName) => {
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
