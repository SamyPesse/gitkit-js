/** @flow */

import path from 'path';
import { Record } from 'immutable';
import GenericFS from '../fs/GenericFS';
import GitObject from './GitObject';

import Tree from './Tree';
import Blob from './Blob';
import Commit from './Commit';

import type { List } from 'immutable';
import type TreeEntry from './TreeEntry';
import type { SHA } from '../types/SHA';

const DEFAULTS: {
    isBare: boolean,
    fs: GenericFS,
} = {
    isBare: false,
    fs: new GenericFS(),
};

class Repository extends Record(DEFAULTS) {

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
    readObject(sha: SHA): Promise<Tree> {
        const { fs } = this;

        return fs
            .read(this.resolveGitFile(GitObject.getPath(sha)))
            .then(buffer => GitObject.createFromZip(buffer));
    }

    /*
     * Read a blob/commit/tree objects by their sha.
     */

    readTree(sha: SHA): Promise<Tree> {
        return this.readObject(sha).then(obj => {
            if (!obj.isTree) {
                throw new Error(`"${sha}" is not a tree`);
            }

            return Tree.createFromObject(obj);
        });
    }

    readBlob(sha: SHA): Promise<Blob> {
        return this.readObject(sha).then(obj => {
            if (!obj.isBlob) {
                throw new Error(`"${sha}" is not a blob`);
            }

            return Blob.createFromObject(obj);
        });
    }

    readCommit(sha: SHA): Promise<Commit> {
        return this.readObject(sha).then(obj => {
            if (!obj.isCommit) {
                throw new Error(`"${sha}" is not a commit`);
            }

            return Commit.createFromObject(obj);
        });
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
                } else {
                    return this.walkTree(entry.sha, iter, filepath);
                }
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
        return this.readCommit(sha).then(commit => {
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

    /*
     * List all local branches in the repository
     */
    listBranches(): Promise<List<string>> {
        return this.listRefs('heads');
    }
}

export default Repository;
