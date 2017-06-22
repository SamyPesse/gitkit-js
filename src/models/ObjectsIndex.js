/** @flow */

import { Record, Map } from 'immutable';
import GitObject from './GitObject';
import Tree from './Tree';
import Blob from './Blob';
import Commit from './Commit';

import type { GitObjectType, GitObjectSerializable } from './GitObject';
import type Repository from './Repository';
import type { SHA } from '../types/SHA';

/*
 * Utility model to lookup an object in the repository.
 *
 * Git obejcts can be stored:
 * - In a packfile, we need to index all packfiles to lookup the object
 * - In a .git/objects/... file
 */

const TYPES: { [GitObjectType]: GitObjectSerializable } = {
    blob: Blob,
    commit: Commit,
    tree: Tree
};

const DEFAULTS: {
    // Map from object sha to the packfile path
    packfiles: Map<SHA, string>,
    // Objects cache from packfile/files/new
    objects: Map<SHA, GitObject>
} = {
    packfiles: Map(),
    objects: Map()
};

class ObjectsIndex extends Record(DEFAULTS) {
    /*
     * Get an object.
     */
    getObject(sha: SHA): ?GitObject {
        const { objects } = this;
        return objects.get(sha);
    }

    getObjectOfType(sha: SHA, type: GitObjectType): Blob | Commit | Tree {
        const object = this.getObject(sha);

        if (!object) {
            return null;
        }

        if (object.type != type) {
            throw new Error(`"${sha}" is not a ${type} but a ${object.type}`);
        }

        return TYPES[type].createFromObject(object);
    }

    getBlob(sha: SHA): ?Blob {
        return this.getObjectOfType(sha, 'blob');
    }

    getTree(sha: SHA): ?Blob {
        return this.getObjectOfType(sha, 'tree');
    }

    getCommit(sha: SHA): ?Blob {
        return this.getObjectOfType(sha, 'commit');
    }

    /*
     * Check if we have already read an object.
     */
    hasObject(sha: SHA): boolean {
        const { objects } = this;
        return objects.has(sha);
    }

    /*
     * Add a git object to the cache.
     */
    addObject(object: GitObject): ?GitObject {
        const { objects } = this;
        return objects.set(object.sha, object);
    }

    /*
     * Read a git object from a repository, and stores it in the index.
     */
    readObject(repo: Repository, sha: SHA): Promise<GitObject> {
        const { fs } = repo;

        if (this.hasObject(sha)) {
            return Promise.resolve(this);
        }

        return fs
            .read(repo.resolveGitFile(GitObject.getPath(sha)))
            .then(buffer => GitObject.createFromZip(buffer))
            .then(object => this.addObject(object));
    }

    /*
     * Index packfiles from repository.
     */
    static indexFromRepository(repo: Repository): Promise<ObjectsIndex> {}
}

export default ObjectsIndex;
