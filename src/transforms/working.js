/** @flow */

import type GitKit from '../GitKit';
import { Blob, IndexEntry } from '../models';

/*
 * Transforms to edit the working index.
 */

const Transforms = {};

Transforms.readWorkingIndex = (gitkit: GitKit): Promise<*> =>
    gitkit.repo.readWorkingIndex().then(repo => (gitkit.repo = repo));

/*
 * Equivalent to the "git add" command
 */
Transforms.addFile = (gitkit: GitKit, filename: string): Promise<*> => {
    const { fs } = gitkit.repo;
    let { workingIndex } = gitkit.repo;

    return Promise.all([
        fs.stat(filename),
        fs.read(filename)
    ]).then(([stat, content]) => {
        const blob = Blob.createFromBuffer(content);

        return gitkit.addBlob(blob).then(({ sha }) => {
            const entry = IndexEntry.createFromFileStat(stat, sha);
            workingIndex = workingIndex.addEntry(entry);

            gitkit.repo = gitkit.repo.merge({
                workingIndex
            });

            return workingIndex.writeToRepo(gitkit.repo);
        });
    });
};

export default Transforms;
