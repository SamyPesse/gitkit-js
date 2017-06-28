/** @flow */
/* eslint-disable no-console */

import type Repository from '../models/Repository';

/*
 * Log the list of remotes.
 */
function listRemotes(repo: Repository): Promise<*> {
    const transform = repo.transform();

    return transform.readConfig().then(() => {
        const { remotes } = transform.repo;

        remotes.forEach((remote, name) => {
            console.log(name);
        });
    });
}

export default {
    name: 'remote',
    description: 'Manage set of tracked repositories',
    exec: listRemotes,
    options: []
};
