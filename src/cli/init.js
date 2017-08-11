/** @flow */
/* eslint-disable no-console */

import path from 'path';
import GitKit, { Repository } from '../';
import NativeFS from '../fs/NativeFS';

type Kwargs = {
    bare: boolean
};

function init(
    _gitkit: GitKit,
    [relativeDir = '']: string[],
    { bare }: Kwargs
): Promise<*> {
    const directory = path.resolve(process.cwd(), relativeDir);
    const repo = new Repository({
        fs: new NativeFS(directory),
        isBare: bare
    });
    const gitkit = new GitKit(repo);

    return gitkit.init().then(() => {
        console.log(
            `Initialized empty Git repository in ${bare
                ? directory
                : path.join(directory, '.git')}`
        );
    });
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
