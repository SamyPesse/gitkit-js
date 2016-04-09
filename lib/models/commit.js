var Immutable = require('immutable');
var Author = require('./author');

var parseCommit = require('../utils/parseCommit');

var Commit = Immutable.Record({
    author: Author(),
    committer: Author(),
    tree: String(),
    parents: Immutable.List(),
    message: String()
});

/*
    Parse a commit from a String

    @param {String} content
    @return {Commit}
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

/*
    Parse a commit from a Buffer

    @param {Buffer} content
    @return {Commit}
*/
Commit.createFromBuffer = function(content) {
    return Commit.createFromString(content.toString('utf8'));
};

/*
    Parse a commit from a GitObject

    @param {GitObject} obj
    @return {Commit}
*/
Commit.createFromObject = function(obj) {
    return Commit.createFromBuffer(obj.getContent());
};

module.exports = Commit;
