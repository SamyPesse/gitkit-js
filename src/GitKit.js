/* @flow */

import Debug from 'debug';
import Transforms from './transforms';

import type { Repository, GitObject, Ref, Blob, Tree, Commit } from './models';
import type { SHA } from './types/SHA';

const debug = Debug('gitkit:transform');

class GitKit {
    initialRepo: Repository;
    repo: Repository;

    constructor(repo: Repository) {
        this.initialRepo = repo;
        this.repo = repo;
        this.queue = Promise.resolve();
    }

    indexObjects: () => Promise<*>;
    readObject: (sha: SHA) => Promise<GitObject>;
    addObject: (object: GitObject) => Promise<*>;
    addBlob: (blob: Blob) => Promise<*>;
    addTree: (tree: Tree) => Promise<*>;
    addCommit: (commit: Commit) => Promise<*>;

    walkCommits: (
        sha: SHA,
        iter: (commit: Commit, sha: SHA) => ?boolean
    ) => Promise<*>;

    walkTree: (
        sha: SHA,
        iter: (entry: TreeEntry, filepath: string) => *
    ) => Promise<*>;

    writeFile: (filename: string, content: Buffer | string) => Promise<*>;
    mkdir: (filename: string) => Promise<*>;
    unlinkFile: (filename: string) => Promise<*>;

    // Refs
    readHEAD: () => Promise<*>;
    indexRefs: () => Promise<*>;
    updateRef: (name: string, ref: Ref) => GitKit;

    // Working index
    readWorkingIndex: () => Promise<*>;
    addFile: (filename: string) => Promise<*>;

    readConfig: () => Promise<*>;
    flushConfig: () => Promise<*>;
    addRemote: (name: string, url: string) => Promise<*>;
}

/*
 * Bind all transforms.
 */
Object.keys(Transforms).forEach(type => {
    GitKit.prototype[type] = function transform(...args) {
        debug(type, { args });
        return Transforms[type](this, ...args);
    };
});

export default GitKit;
