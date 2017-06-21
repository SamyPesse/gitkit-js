/** @flow */

import { Record, Map } from 'immutable';
import GitObject from './GitObject';

import type Repository from './Repository';
import type { SHA } from '../types/SHA';

/*
 * Utility model to lookup an object in the repository.
 *
 * Git obejcts can be stored:
 * - In a packfile, we need to index all packfiles to lookup the object
 * - In a .git/objects/... file
 */

const DEFAULTS: {
    // Map from object sha to the packfile path
    packfiles: Map<SHA,string>
} = {
    packfiles: Map()
};

class ObjectsIndex extends Record(DEFAULTS) {

    /*
     * Read a git object from a repository.
     */
    readObject(
        repo: Repository,
        sha: SHA
    ): Promise<GitObject> {

    }

    /*
     * Index packfiles from repository.
     */
    static indexFromRepository(
        repo: Repository
    ): Promise<ObjectsIndex> {

    }
}

export default ObjectsIndex;
