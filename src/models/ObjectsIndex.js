/** @flow */

import path from 'path';
import Debug from 'debug';
import { Record, Map } from 'immutable';
import GitObject from './GitObject';
import Tree from './Tree';
import Blob from './Blob';
import Commit from './Commit';
import PackFileIndex from './PackFileIndex';
import PackFile from './PackFile';

import type { GitObjectType, GitObjectSerializable } from './GitObject';
import type Repository from './Repository';
import type { SHA } from '../types/SHA';

/*
 * Utility model to lookup an object in the repository.
 *
 * Git objects can be stored:
 * - In a packfile, we need to index all packfiles to lookup the object
 * - In a .git/objects/... file
 */

const debug = Debug('gitkit:objects');

const TYPES: { [GitObjectType]: GitObjectSerializable } = {
    blob: Blob,
    commit: Commit,
    tree: Tree
};

const DEFAULTS: {
    // Map from packfile path to its index
    packfiles: Map<string, PackFileIndex>,
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
            throw new Error(`object "${sha}" not found`);
        }

        if (object.type != type) {
            throw new Error(`"${sha}" is not a ${type} but a ${object.type}`);
        }

        return TYPES[type].createFromObject(object);
    }

    getBlob(sha: SHA): Blob {
        return this.getObjectOfType(sha, 'blob');
    }

    getTree(sha: SHA): Tree {
        return this.getObjectOfType(sha, 'tree');
    }

    getCommit(sha: SHA): Commit {
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
        const { sha } = object;

        debug(`index object ${sha}`);
        return this.merge({
            objects: objects.set(sha, object)
        });
    }

    /*
     * Get packfile containing a git object.
     */
    getPackFor(sha: SHA): ?string {
        const { packfiles } = this;
        return packfiles.findKey(index => index.hasObject(sha));
    }

    /*
     * Return true if object is in a packfile.
     */
    isPacked(sha: SHA): boolean {
        return !!this.getPackFor(sha);
    }

    /*
     * Read a git object from a repository, and stores it in the index.
     */
    readObject(repo: Repository, sha: SHA): Promise<GitObject> {
        if (this.hasObject(sha)) {
            return Promise.resolve(this);
        }

        return this.isPacked(sha)
            ? this.readObjectFromPack(repo, sha)
            : this.readObjectFromFiles(repo, sha);
    }

    /*
     * Read a git object from the files in .git/objects
     */
    readObjectFromFiles(repo: Repository, sha: SHA): Promise<GitObject> {
        const { fs } = repo;

        debug(`read object ${sha} from file`);
        return fs
            .read(repo.resolveGitFile(GitObject.getPath(sha)))
            .then(buffer => GitObject.createFromZip(buffer))
            .then(object => this.addObject(object));
    }

    /*
     * Read a git object from a packfile.
     */
    readObjectFromPack(repo: Repository, sha: SHA): Promise<GitObject> {
        const { fs } = repo;
        const packFilename = this.getPackFor(sha);

        if (!packFilename) {
            return Promise.reject(new Error(`No packfile contains ${sha}`));
        }

        // TODO: avoid reading the whole packfile each time.
        debug(`read object ${sha} from packfile ${packFilename}`);
        return fs
            .read(packFilename)
            .then(buffer => PackFile.createFromBuffer(buffer))
            .then(packfile => packfile.getObject(sha))
            .then(object => {
                if (!object) {
                    throw new Error('Error while reading object from packfile');
                }

                return this.addObject(object);
            });
    }

    /*
     * Write an object to the disk.
     */
    writeObjectToRepository(repo: Repository, object: GitObject): Promise<*> {
        const { fs } = repo;
        const buffer = object.getAsBuffer();
        const objectPath = repo.resolveGitFile(object.path);

        debug(`write object ${objectPath} to disk`);
        return fs.writeFile(objectPath, buffer);
    }

    /*
     * Index packfiles from repository.
     * It list all packfile index, read them, and index them.
     */
    static indexFromRepository(repo: Repository): Promise<ObjectsIndex> {
        const { fs } = repo;

        return fs
            .readTree(repo.resolveGitFile('objects/pack/'))
            .then(files =>
                files.reduce((prev, file) => {
                    const filepath = file.path;

                    if (path.extname(filepath) !== '.idx') {
                        return prev;
                    }

                    const baseName = path.basename(filepath, '.idx');
                    const pack = files.find(
                        packfile =>
                            path.extname(packfile.path) == '.pack' &&
                            path.basename(packfile.path, '.pack') == baseName
                    );

                    if (!pack) {
                        return prev;
                    }

                    return prev.then(packfiles =>
                        fs
                            .read(filepath)
                            .then(buffer =>
                                PackFileIndex.createFromBuffer(buffer)
                            )
                            .then(index => packfiles.set(pack.path, index))
                    );
                }, Promise.resolve(Map()))
            )
            .then(packfiles => new ObjectsIndex({ packfiles }));
    }
}

export default ObjectsIndex;
