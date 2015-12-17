var util = require('util');
var _ = require('lodash');

var GitObject = require('./object');
var GitTree = require('./tree');
var Author = require('./author');

var parse = require('./utils/parse');

function GitCommit(repo, sha) {
    if (!(this instanceof GitCommit)) return new GitCommit(repo, sha);
    GitObject.apply(this, arguments);

    this.author;
    this.committer;
    this.tree;
    this.parents = [];
    this.message = '';
}
util.inherits(GitCommit, GitObject);

// Parse infos about the commit
GitCommit.prototype.parse = function() {
    var that = this;

    return this.read()
        .then(function(content) {
            var info = parse.commit(content.toString());

            that.message = _.compact([info.title, info.description]).join('\n');
            that.author = new Author(info.author);
            that.committer = new Author(info.committer);

            that.tree = new GitTree(that.repo, info.tree);

            that.parents = _.map(info.parents, function(sha) {
                return new GitCommit(that.repo, sha);
            });
        })
        .thenResolve(this);
};

// Convert commit infos to string
GitCommit.prototype.toString = function() {
    // todo
};

// Write this commit and update its sha
GitCommit.prototype.create = function() {
    return GitObject.prototype.create.call(this, this.toString());
};

module.exports = GitCommit;
