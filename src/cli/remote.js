/** @flow */
/* eslint-disable no-console */

import type GitKit from '../';

/*
 * Log the list of remotes.
 */
function listRemotes(gitkit: GitKit): Promise<*> {
    return gitkit.readConfig().then(() => {
        const { config } = gitkit.repo;

        config.remotes.forEach((remote, name) => {
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
