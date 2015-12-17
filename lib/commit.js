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

// Info infos about commit
GitCommit.prototype.update = function(info) {
    this.message = this.message || _.compact([info.title, info.description]).join('\n');

    this.author = (info.author instanceof Author)? info.author : new Author(info.author);
    this.committer = (info.committer instanceof Author)? info.committer : new Author(info.author);

    this.tree = (info.tree instanceof GitTree)? info.tree : new GitTree(this.repo, info.tree);

    this.parents = _.map(info.parents, function(sha) {
        return (sha instanceof GitCommit)? sha : new GitCommit(this.repo, sha);
    }, this);

    return this;
};

// Parse infos about the commit
GitCommit.prototype.parse = function() {
    var that = this;

    return this.read()
        .then(function(content) {
            var info = parse.commit(content.toString());
            return that.update(info);
        });
};

// Convert commit infos to string
GitCommit.prototype.toString = function() {
    // todo
};

module.exports = GitCommit;
