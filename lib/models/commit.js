var Immutable = require('immutable');

var Author = require('./author');
var GitObject = require('./object');
var parseCommit = require('../utils/parseCommit');

var Commit = Immutable.Record({
    author: Author(),
    committer: Author(),
    tree: String(),
    parents: Immutable.List(),
    message: String()
});

Commit.prototype.getAuthor = function() {
    return this.get('author');
};

Commit.prototype.getCommitter = function() {
    return this.get('committer');
};

Commit.prototype.getTree = function() {
    return this.get('tree');
};

Commit.prototype.getParents = function() {
    return this.get('parents');
};

Commit.prototype.getMessage = function() {
    return this.get('message');
};

/**
 * Parse a commit from a String
 *
 * @param {String} content
 * @return {Commit}
 */
Commit.createFromString = function(content) {
    var info = parseCommit(content);

    return new Commit({
        author: Author(info.author),
        committer: Author(info.committer),
        tree: info.tree,
        parents: Immutable.List(info.parents),
        message: info.message
    });
};

/**
 * Parse a commit from a Buffer
 *
 * @param {Buffer} content
 * @return {Commit}
 */
Commit.createFromBuffer = function(content) {
    return Commit.createFromString(content.toString('utf8'));
};

/**
 * Parse a commit from a GitObject
 *
 * @param {GitObject} obj
 * @return {Commit}
 */
Commit.createFromObject = function(obj) {
    return Commit.createFromBuffer(obj.getContent());
};

/**
 * Create a new commit from metadat
 *
 * @param {Object}
 * @return {Commit}
 */
Commit.create = function(obj) {
    return new Commit({
        author: obj.author,
        committer: obj.committer,
        tree: obj.tree,
        parents: Immutable.List(obj.parents),
        message: obj.message
    });
};

/*
 * Read a commit object by its sha from a repository
 *
 * @param {Repository} repo
 * @param {String} sha
 * @return {Promise<Commit>}
 */
Commit.readFromRepo = function(repo, sha) {
    return GitObject.readFromRepo(repo, sha)
        .then(function(obj) {
            if (!obj.isCommit()) {
                throw new Error('Object "' + sha + '" is not a commit');
            }

            return Commit.createFromObject(obj);
        });
};

module.exports = Commit;
