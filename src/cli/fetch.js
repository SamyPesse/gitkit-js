/** @flow */
/* eslint-disable no-console */

import type GitKit from '../';

/*
 * Download objects and refs from another repository
 */
function fetch(gitkit: GitKit): Promise<*> {}

export default {
    name: 'fetch [repository] [refspec]',
    description: 'Download objects and refs from another repository',
    exec: fetch,
    options: []
};
