var Immutable = require('immutable');
var path = require('path');

import type Repository from './repo';

const defaultRecord: {
    commit: string
} = {
    commit: ''
};

class Ref extends Immutable.Record(defaultRecord) {
    getCommit() : string {
        return this.get('commit');
    }

    /**
     * Output the reference as a string
     * @return {String}
     */
    toString() : string {
        return this.getCommit() + '\n';
    }

    /**
     * Output the reference as a buffer
     * @return {Buffer}
     */
    toBuffer() : Buffer {
        return new Buffer(this.toString(), 'utf8');
    }

    /**
     * Return path to a ref by its sha
     * @paran {String} name
     * @return {String}
     */
    static getPath(name: string) : string {
        return path.join('refs', name);
    }

    /**
     * Parse a ref from a String
     * @param {String} content
     * @return {Ref}
     */
    static createFromString(content: string) : Ref {
        var sha = content.trim();
        return Ref.createForCommit(sha);
    }

    /**
     * Parse a ref from a Buffer
     * @param {Buffer} content
     * @return {Ref}
     */
    static createFromBuffer(content: Buffer) : Ref {
        return Ref.createFromString(content.toString('utf8'));
    }

    /**
     * Create ref using a commit sha
     * @param {String} sha
     * @return {Ref}
     */
    static createForCommit(sha: string) : Ref {
        return new Ref({
            commit: sha
        });
    }

    /**
     * Read a ref from a repository using its name
     * @param {Repository} repo
     * @paran {String} name
     * @return {Promise<Ref>}
     */
    static readFromRepoByName(repo: Repository, name: string) : Promise<Ref> {
        var refPath = Ref.getPath(name);
        return Ref.readFromRepo(repo, refPath);
    }

    /**
     * Read a ref from a repository using its filename
     * @param {Repository} repo
     * @paran {String} refPath
     * @return {Promise<Ref>}
     */
    static readFromRepo(repo: Repository, refPath: string) : Promise<Ref> {
        return repo.readGitFile(refPath)
            .then(Ref.createFromBuffer);
    }

    /**
     * Read a ref from a repository using its filename
     * @param {Repository} repo
     * @paran {String} refPath
     * @return {Promise}
     */
    static writeToRepo(repo: Repository, refPath: string, ref: string) : Promise {
        return repo.writeGitFile(refPath, ref.toBuffer());
    }
}

module.exports = Ref;
