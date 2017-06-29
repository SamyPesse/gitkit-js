/** @flow */
/* eslint-disable no-console */

import type GitKit from '../';

function status(gitkit: GitKit): Promise<*> {
    return gitkit
        .readWorkingIndex()
        .then(() => gitkit.readHEAD())
        .then(() => gitkit.indexRefs())
        .then(() => gitkit.indexObjects())
        .then(() => gitkit.readCommit(gitkit.repo.headCommit))
        .then(commit => gitkit.readRecursiveTree(commit.tree))
        .then(tree => {
            const { workingIndex } = gitkit.repo;

            const indexedFiles = workingIndex.entries.keySeq().toSet();
            const commitedFiles = tree.entries.keySeq().toSet();

            const allFiles = indexedFiles.union(commitedFiles);

            const deleted = [];
            const added = [];
            const modified = [];

            allFiles.forEach(file => {
                const indexedFile = workingIndex.entries.get(file);
                const commitedFile = tree.entries.get(file);

                if (!commitedFile) {
                    added.push(file);
                } else if (!indexedFile) {
                    deleted.push(file);
                } else if (commitedFile.sha != indexedFile.sha) {
                    modified.push(file);
                }
            });

            console.log('deleted', deleted);
            console.log('added', added);
            console.log('modified', modified);
        });
}

export default {
    name: 'status',
    description: 'Show the working tree status',
    exec: status,
    options: []
};
