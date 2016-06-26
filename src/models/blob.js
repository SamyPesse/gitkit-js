// @flow

var Immutable = require('immutable');
var Promise   = require('q');
var GitObject = require('./object');

import type Repository from './repo';

var defaultRecord: {
    content: Buffer
} = {
    content: new Buffer('')
};

class Blob extends Immutable.Record(defaultRecord) {
    /**
     * Return the content as a buffer of this blob
     * @return {Buffer}
     */
    getContent() : Buffer {
        return this.get('content');
    }

    /**
     * Return the size of this blob
     * @return {Number}
     */
    getContentSize() : number {
        return this.getContent().length;
    }

    /**
     * Transform this blob into a git object
     * @return {GitObject}
     */
    toGitObject() : GitObject {
        return GitObject.create(GitObject.TYPES.BLOB, this.getContent());
    }

    /**
     * Create a blob from a Buffer
     * @param {Buffer} content
     * @return {Blob}
     */
    static createFromBuffer(content: Buffer) : Blob {
        return new Blob({
            content: content
        });
    }

    /**
     * Create a blob from a String
     * @param {String} content
     * @return {Blob}
     */
    static createFromString(content: string) : Blob {
        return Blob.createFromBuffer(new Buffer(content, 'utf8'));
    }

    /**
     * Create a blob from a GitObject
     * @param {GitObject} obj
     * @return {Blob}
     */
    static createFromObject(obj: GitObject) : Blob {
        return Blob.createFromBuffer(obj.getContent());
    }

    /**
     * Read a blob by its sha from a repository
     * @param {Repository} repo
     * @param {String} sha
     * @return {Promise<Blob>}
     */
    static readFromRepo(repo: Repository, sha: string) : Promise {
        return GitObject.readFromRepo(repo, sha)
            .then(function(obj) {
                if (!obj.isBlob()) {
                    throw new Error('Object "' + sha + '" is not a blob');
                }

                return Blob.createFromObject(obj);
            });
    }

    /**
     * Write a blob in a repository.
     * It returns the new sha of this blob.
     *
     * @param {Repository} repo
     * @param {Blob} blob
     * @return {Promise<String>}
     */
    static writeToRepo(repo: Repository, blob: Blob) {
        var gitObject = blob.toGitObject();
        return GitObject.writeToRepo(repo, gitObject);
    }
}

module.exports = Blob;
