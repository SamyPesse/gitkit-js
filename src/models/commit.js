// @flow

var Immutable = require('immutable');

var Author = require('./author');
var GitObject = require('./object');
var parseCommit = require('../utils/parseCommit');

import type Repository from './repo';

var defaultRecord: {
    author:    Author,
    committer: Author,
    tree:      string,
    parents:   Immutable.List,
    message:   string
} = {
    author:    Author(),
    committer: Author(),
    tree:      '',
    parents:   Immutable.List(),
    message:   ''
};

class Commit extends Immutable.Record(defaultRecord) {
    getAuthor() : Author {
        return this.get('author');
    }

    getCommitter() : Author {
        return this.get('committer');
    }

    getTree() : string {
        return this.get('tree');
    }

    getParents() : Immutable.List {
        return this.get('parents');
    }

    getMessage() : string {
        return this.get('message');
    }

    /**
     * Parse a commit from a String
     *
     * @param {String} content
     * @return {Commit}
     */
    static createFromString(content: string) : Commit {
        var info = parseCommit(content);

        return new Commit({
            author:    Author(info.author),
            committer: Author(info.committer),
            tree:      info.tree,
            parents:   Immutable.List(info.parents),
            message:   info.message
        });
    }

    /**
     * Parse a commit from a Buffer
     *
     * @param {Buffer} content
     * @return {Commit}
     */
    static createFromBuffer(content: Buffer) : Commit {
        return Commit.createFromString(content.toString('utf8'));
    }

    /**
     * Parse a commit from a GitObject
     *
     * @param {GitObject} obj
     * @return {Commit}
     */
    static createFromObject(obj: GitObject) : Commit {
        return Commit.createFromBuffer(obj.getContent());
    }

    /**
     * Create a new commit from metadat
     *
     * @param {Object}
     * @return {Commit}
     */
    static create(obj) : Commit {
        return new Commit({
            author:    obj.author,
            committer: obj.committer,
            tree:      obj.tree,
            parents:   Immutable.List(obj.parents),
            message:   obj.message
        });
    }

    /*
     * Read a commit object by its sha from a repository
     *
     * @param {Repository} repo
     * @param {String} sha
     * @return {Promise<Commit>}
     */
    static readFromRepo(repo: Repository, sha: string) : Promise {
        return GitObject.readFromRepo(repo, sha)
            .then(function(obj) {
                if (!obj.isCommit()) {
                    throw new Error('Object "' + sha + '" is not a commit');
                }

                return Commit.createFromObject(obj);
            });
    }
}

module.exports = Commit;
