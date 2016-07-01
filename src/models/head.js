// @flow

var Immutable = require('immutable');
var parseMap = require('../utils/parseMap');

import type Promise from 'q';
import type Repository from './repo';

var defaultRecord: {
    ref: string
} = {
    ref: ''
};

class Head extends Immutable.Record(defaultRecord) {
    getRef() : string {
        return this.get('ref');
    }

    /**
     * Output the head as a string
     * @return {String}
     */
    toString() : string {
        return 'ref: ' + this.getRef() + '\n';
    }

    /**
     * Parse a ref from a String
     * @param {String} content
     * @return {Head}
     */
    static createFromString(content: string) : Head {
        var map = parseMap(content);
        return Head.createForRef(map.get('ref'));
    }

    /**
     * Create a head for a ref
     * @param {String} ref
     * @return {Head}
     */
    static createForRef(ref: string) : Head {
        return new Head({
            ref: ref
        });
    }

    /**
     * Parse a head from a Buffer
     * @param {Buffer} content
     * @return {Head}
     */
    static createFromBuffer(content: Buffer) : Head {
        return Head.createFromString(content.toString('utf8'));
    }

    /**
     * Read a head from a repository using its path
     * @param {Repository} repo
     * @param {String} filename
     * @return {Promise<Head>}
     */
    static readFromRepo(repo: Repository, filename: string = 'HEAD') : Promise<Head> {
        return repo.readGitFile(filename)
            .then(Head.createFromBuffer);
    }

    /**
     * Write a head to a repository
     *
     * @param {Repository} repo
     * @param {Head} head
     * @param {String} filename
     * @return {Promise<Head>}
     */
    static writeToRepo(repo: Repository, head: Head, filename: string = 'HEAD') : Promise<Head> {
        var headContent = head.toString();

        return repo.writeGitFile(filename, new Buffer(headContent, 'utf8'));
    }
}

module.exports = Head;
