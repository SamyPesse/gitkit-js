/** @flow */

import type GitKit from '../GitKit';

/*
 * Transforms to edit files.
 */

const Transforms = {};

Transforms.writeFile = (
    gitkit: GitKit,
    filename: string,
    content: Buffer | string
): Promise<*> => {
    const { fs } = gitkit.repo;
    return fs.write(filename, content);
};

Transforms.mkdir = (gitkit: GitKit, dirname: string): Promise<*> => {
    const { fs } = gitkit.repo;
    return fs.mkdir(dirname);
};

Transforms.unlinkFile = (gitkit: GitKit, filename: string): Promise<*> => {
    const { fs } = gitkit.repo;
    return fs.unlinkFile(filename);
};

export default Transforms;
