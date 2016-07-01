// @flow

var Immutable = require('immutable');
var path = require('path');

var zlib = require('../utils/zlib');
var sha1 = require('../utils/sha1');

import type Repository from './repo';

var TYPES = {
    TREE: 'tree',
    BLOB: 'blob',
    COMMIT: 'commit'
};

var defaultRecord: {
    type:    string,
    content: Buffer
} = {
    type:    '',
    content: new Buffer('')
};

class GitObject extends Immutable.Record(defaultRecord) {
    getType() : string {
        return this.get('type');
    }

    getContent() : Buffer {
        return this.get('content');
    }

    isTree() : boolean {
        return this.getType() === TYPES.TREE;
    }

    isBlob() : boolean {
        return this.getType() === TYPES.BLOB;
    }

    isCommit() : boolean {
        return this.getType() === TYPES.COMMIT;
    }

    /**
     * Calcul the sha of this object
     * @return {String}
     */
    getSha() : string {
        return sha1.encode(this.getAsBuffer());
    }

    /**
     * Return this git object as a buffer
     * @param {Buffer}
     */
    getAsBuffer() : Buffer {
        var type = this.getType();
        var content = this.getContent();

        var nullBuf = new Buffer(1);
        nullBuf.fill(0);

        return Buffer.concat([
            (new Buffer(type + ' ' + content.length, 'utf8')),
            nullBuf,
            content
        ]);
    }

    /**
     * Return path to an object by its sha
     * @paran {String} sha
     * @return {String}
     */
    static getPath(sha) : string {
        return path.join('objects', sha.slice(0, 2), sha.slice(2));
    }

    /**
     * Read an object from a repository using its SHA
     * @param {Repository} repo
     * @paran {String} sha
     * @return {Promise<GitObject>}
     */
    static readFromRepo(repo: Repository, sha: string) : Promise<GitObject> {
        var objectPath = GitObject.getPath(sha);

        return repo.readGitFile(objectPath)
            .then(GitObject.createFromZip);
    }

    /**
     * Create a Git object from a zip content
     * @param {Buffer} content
     * @return {GitObject}
     */
    static createFromZip(content: Buffer) : GitObject {
        return GitObject.createFromBuffer(
            zlib.unzip(content)
        );
    }

    /**
     * Create a Git object from a zip content
     * @param {Buffer} content
     * @return {GitObject}
     */
    static createFromBuffer(content: Buffer) : GitObject {
        var nullChar = content.indexOf(0);

        // Parse object header
        var header = content.slice(0, nullChar).toString();
        var type = header.split(' ')[0];

        // Extract content
        var innerContent = content.slice(nullChar + 1);

        return new GitObject({
            type:    type,
            content: innerContent
        });
    }

    /**
     * Write a git object in a repository.
     * It returns the new sha of this object.
     * @param {Repository} repo
     * @param {GitObject} obj
     * @return {Promise<String>}
     */
    static writeToRepo(repo: Repository, obj: GitObject) : Promise {
        // Output object as a buffer
        var content = obj.getAsBuffer();

        // Calcul sha1 for the buffer
        var sha = sha1.encode(content);

        // Calcul path for this sha
        var objectPath = GitObject.getPath(sha);

        // Zip and write the buffer
        return repo.writeGitFile(objectPath, zlib.zip(content))
            .thenResolve(sha);
    }

    /**
     * Create a Git object from a content and a type
     * @param {String} type
     * @param {Buffer} content
     * @return {GitObject}
     */
    static create(type: string, content: Buffer) : GitObject {
        return new GitObject({
            type:    type,
            content: content
        });
    }

    static get TYPES() {
        return TYPES;
    }
}

module.exports = GitObject;
