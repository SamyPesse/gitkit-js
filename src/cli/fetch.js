/** @flow */
/* eslint-disable no-console */

import type { Repository } from '../';

/*
 * Download objects and refs from another repository
 */
function fetch(repo: Repository): Promise<*> {}

export default {
    name: 'fetch [repository] [refspec]',
    description: 'Download objects and refs from another repository',
    exec: fetch,
    options: []
};
