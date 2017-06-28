/* @flow */

import Debug from 'debug';
import type Repository from './Repository';
import Transforms from '../transforms';

import type GitObject from './GitObject';
import type Blob from './Blob';
import type Tree from './Tree';
import type Commit from './Commit';
import type { SHA } from '../types/SHA';

const debug = Debug('gitkit:transform');

class Transform {
    initialRepo: Repository;
    repo: Repository;

    constructor(repo: Repository) {
        this.initialRepo = repo;
        this.repo = repo;
        this.queue = Promise.resolve();
    }

    then(
        next: (transform: Transform) => *,
        onError?: (error: Error) => *
    ): Transform {
        this.queue = this.queue.then(() => next(this), onError);
        return this;
    }

    catch(onError: (error: Error) => *): Transform {
        return this.then(() => {}, onError);
    }

    readObject: (sha: SHA) => Transform;
    addObject: (object: GitObject) => Transform;
    addBlob: (blob: Blob) => Transform;
    addTree: (tree: Tree) => Transform;
    addCommit: (commit: Commit) => Transform;

    writeFile: (filename: string, content: Buffer | string) => Transform;
    mkdir: (filename: string) => Transform;
    unlinkFile: (filename: string) => Transform;

    addFile: (filename: string) => Transform;

    readConfig: () => Transform;
    flushConfig: () => Transform;
    addRemote: (name: string, url: string) => Transform;
}

/*
 * Bind all transforms.
 */
Object.keys(Transforms).forEach(type => {
    Transform.prototype[type] = function transform(...args) {
        return this.then(() => {
            debug(type, { args });
            return Transforms[type](this, ...args);
        });
    };
});

export default Transform;
