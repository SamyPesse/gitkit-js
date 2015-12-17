var util = require('util');
var _ = require('lodash');

var GitObject = require('./object');
var Author = require('./author');
var parse = require('./utils/parse');

function GitCommit(repo, sha) {
    if (!(this instanceof GitCommit)) return new GitCommit(repo, sha);
    GitObject.apply(this, arguments);
}
util.inherits(GitCommit, GitObject);

// Parse infos about the commit
GitCommit.prototype.parse = function() {
    var that = this;

    return this.read()
        .then(function() {
            _.extend(that, parse.commit(that.content.toString()));
        })
        .thenResolve(this);
};

module.exports = GitCommit;
