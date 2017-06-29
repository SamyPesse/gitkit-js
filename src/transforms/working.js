/** @flow */

import type GitKit from '../GitKit';

/*
 * Transforms to edit the working index.
 */

const Transforms = {};

Transforms.readWorkingIndex = (gitkit: GitKit): Promise<*> =>
    gitkit.repo.readWorkingIndex().then(repo => (gitkit.repo = repo));

Transforms.addFile = (gitkit: GitKit, filename: string): Promise<*> => {
    const { fs } = gitkit.repo;

    return fs.stat(filename).then(stat => {});
};

export default Transforms;
