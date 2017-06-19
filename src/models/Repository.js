/** @flow */

import path from 'path';
import { Record } from 'immutable';
import GenericFS from '../fs/GenericFS';
import GitObject from './GitObject';

import Tree from './Tree';
import Blob from './Blob';
import Commit from './Commit';

import type TreeEntry from './TreeEntry';

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
    readObject(sha: string): Promise<Tree> {
        const { fs } = this;

        return fs
            .read(this.resolveGitFile(GitObject.getPath(sha)))
            .then(buf => GitObject.createFromZip(buf));
    }

    /*
     * Read a blob/commit/tree objects by their sha.
     */

    readTree(sha: string): Promise<Tree> {
        return this.readObject(sha).then(obj => {
            if (!obj.isTree) {
                throw new Error(`"${sha}" is not a tree`);
            }

            return Tree.createFromObject(obj);
        });
    }

    readBlob(sha: string): Promise<Blob> {
        return this.readObject(sha).then(obj => {
            if (!obj.isTree) {
                throw new Error(`"${sha}" is not a blob`);
            }

            return Blob.createFromObject(obj);
        });
    }

    readCommit(sha: string): Promise<Commit> {
        return this.readObject(sha).then(obj => {
            if (!obj.isTree) {
                throw new Error(`"${sha}" is not a commit`);
            }

            return Commit.createFromObject(obj);
        });
    }

    /*
     * Recursively walk a tree. The iterator is called for each tree entry.
     */
    walkTree(
        sha: string,
        iter: (entry: TreeEntry, filepath: string) => *,
        baseName: ?string = ''
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
}

export default Repository;
