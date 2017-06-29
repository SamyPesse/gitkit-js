/** @flow */
/* eslint-disable no-console */

import GitKit, { Repository } from '../';
import NativeFS from '../fs/NativeFS';

type Kwargs = {
    bare: boolean
};

function init(_gitkit: GitKit, { bare }: Kwargs): Promise<*> {
    const repo = new Repository({
        fs: new NativeFS(process.cwd()),
        isBare: bare
    });
    const gitkit = new GitKit(repo);

    return gitkit.init();
}

export default {
    name: 'init [directory]',
    description:
        'Create an empty Git repository or reinitialize an existing one',
    exec: init,
    options: [
        {
            type: 'boolean',
            name: 'bare',
            describe: 'Create a bare repository.',
            default: false
        }
    ]
};
