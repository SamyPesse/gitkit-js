/** @flow */
/* eslint-disable no-console */

import type Repository from '../models/Repository';

/*
 * Log the list of refs in the repository
 */
function showRef(
    repo: Repository
): Promise<*> {
    return repo.listRefs()
    .then((refs) => {
        console.log(refs);
        return refs.reduce(
            (prev, refName) => (
                prev
                .then(() => repo.resolveRefToLast(refName))
                .then((ref) => console.log(`${ref.commit}  ${refName}`))
            ),
            Promise.resolve()
        )
    });
}

export default {
    name: 'show-ref',
    description: 'List references in a local repository',
    exec: showRef,
    options: [],
};
