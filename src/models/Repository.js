/** @flow */

import path from 'path';
import { Record } from 'immutable';
import GenericFS from '../fs/GenericFS';

import WorkingIndex from './WorkingIndex';
import ObjectsIndex from './ObjectsIndex';
import RefsIndex from './RefsIndex';
import Transform from './Transform';
import Head from './Head';
import type TreeEntry from './TreeEntry';
import type { SHA } from '../types/SHA';

const DEFAULTS: {
    isBare: boolean,
    fs: GenericFS,
    // Head reference
    head: Head,
    // Index of working files (only for non-bare repos)
    workingIndex: WorkingIndex,
    // Index to read/edit git objects
    objects: ObjectsIndex,
    // Index to read/edit references
    refs: RefsIndex
} = {
    isBare: false,
    fs: new GenericFS(),
    head: new Head(),
    workingIndex: new WorkingIndex(),
    objects: new ObjectsIndex(),
    refs: new RefsIndex()
};

class Repository extends Record(DEFAULTS) {
    /*
     * Start a transformation.
     */
    transform(): Transform {
        return new Transform(this);
    }

    /*
     * Resolve a file from the .git folder.
     */
    resolveGitFile(file: string): string {
        const { isBare } = this;
        return isBare ? file : path.join('.git', file);
    }

    /*
     * Read a Git object by its sha.
     */
    readObject(sha: SHA): Promise<Repository> {
        return this.objects.readObject(this, sha).then(objects =>
            this.merge({
                objects
            })
        );
    }

    /*
     * Index all objects
     */
    indexObjects(): Promise<Repository> {
        return ObjectsIndex.indexFromRepository(this).then(objects =>
            this.merge({ objects })
        );
    }

    /*
     * Recursively walk a tree. The iterator is called for each tree entry.
     */
    walkTree(
        sha: SHA,
        iter: (entry: TreeEntry, filepath: string) => *,
        baseName: string = ''
    ): Promise<*> {
        return this.readTree(sha).then(tree => {
            const { entries } = tree;
            return entries.reduce((prev, entry) => {
                const filepath = path.join(baseName, entry.path);
                if (!entry.isTree) {
                    return iter(entry, filepath);
                }
                return this.walkTree(entry.sha, iter, filepath);
            }, Promise.resolve());
        });
    }

    /*
     * Recursively walk the commit history. The iterator can return "false" to stop.
     */
    walkCommits(
        sha: SHA,
        iter: (commit: Commit, sha: SHA) => ?boolean
    ): Promise<boolean> {
        return this.readObject(sha).then(commit => {
            if (iter(commit, sha) == false) {
                return true;
            }

            return commit.parents.reduce(
                (prev, parent) =>
                    prev.then(stopped => {
                        if (stopped) {
                            return true;
                        }

                        return this.walkCommits(parent, iter);
                    }),
                Promise.resolve()
            );
        });
    }
}

export default Repository;
