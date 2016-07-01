var Immutable = require('immutable');
var path = require('path');

var FS = require('../fs/base');

import type Promise from 'q';
import type File from './file';

const defaultRecord: {
    bare: boolean,
    fs:   FS
} = {
    bare: false,
    fs:   new FS()
};

class Repository extends Immutable.Record(defaultRecord) {
    isBare() : boolean {
        return this.get('bare');
    }

    getFS() : mixed {
        return this.get('fs');
    }

    /**
     * Read a file from the repository
     *
     * @param {String}
     * @return {Promise<Buffer>}
     */
    readFile(filepath: string) : Promise<Buffer> {
        return this.getFS().read(filepath);
    }

    /**
     * Write a file from the repository
     *
     * @param {String}
     * @param {Buffer}
     * @return {Buffer}
     */
    writeFile(filepath: string, buf: Buffer) {
        return this.getFS().write(filepath, buf);
    }

    /**
     * Get details about a file
     *
     * @param {String}
     * @return {File}
     */
    statFile(filepath: string) : Promise<File> {
        return this.getFS().statFile(filepath);
    }

    /**
     * Read a directory from the repository
     *
     * @param {String}
     * @return {List<String>}
     */
    readDir(filepath: string) : Promise<Immutable.List<string>> {
        return this.getFS().readDir(filepath);
    }

    /**
     * Get absolute path toa file related to the git content
     *
     * @param {String}
     * @return {String}
     */
    getGitPath(filepath: string) : string {
        return this.isBare()? filepath : path.join('.git', filepath);
    }

    /**
     * Read a git file from the repository (file in the '.git' directory)
     *
     * @param {String}
     * @return {Buffer}
     */
    readGitFile(filepath: string) : Promise<Buffer> {
        filepath = this.getGitPath(filepath);
        return this.readFile(filepath);
    }

    /**
     * Write a git file from the repository (file in the '.git' directory)
     *
     * @param {String}
     * @param {Buffer}
     * @return {Buffer}
     */
    writeGitFile(filepath: string, buf: Buffer) : Promise {
        filepath = this.getGitPath(filepath);
        return this.writeFile(filepath, buf);
    }

    /**
     * Stat a git file from the repository (file in the '.git' directory)
     *
     * @param {String}
     * @return {File}
     */
    statGitFile(filepath: string) : Promise<File> {
        filepath = this.getGitPath(filepath);
        return this.statFile(filepath);
    }

    /**
     * List content of a directory (inside the .git)
     *
     * @param {String}
     * @return {Promise<List<String>>}
     */
    readGitDir(filepath: string) : Promise<Immutable.List<string>> {
        filepath = this.getGitPath(filepath);
        return this.readDir(filepath);
    }

    /**
     * Create a repository with an fs instance
     *
     * @param {String}
     * @return {Repository}
     */
    static createWithFS(fs: FS, isBare: boolean) {
        return new Repository({
            bare: isBare,
            fs: fs
        });
    }
}

module.exports = Repository;
