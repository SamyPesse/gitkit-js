/** @flow */
/* eslint-disable no-console */

import type GitKit from '../';

function add(gitkit: GitKit, [filename]: string[]): Promise<*> {
    return gitkit.readWorkingIndex().then(() => gitkit.addFile(filename));
}

export default {
    name: 'add [file]',
    description: 'Add file contents to the index',
    exec: add,
    options: []
};
