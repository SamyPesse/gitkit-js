var util = require('util');

var GitObject = require('./object');
var Author = require('./author');

function GitCommit(repo, sha) {
    if (!(this instanceof GitCommit)) return new GitCommit(repo, sha);
    GitObject.apply(this, arguments);

    this.fields = {};
}
util.inherits(GitCommit, GitObject);

// Parse infos about the commit
GitCommit.prototype.parse = function() {
    var that = this;

    return this.read()
        .then(function() {

        })
        .thenResolve(this);
};

module.exports = GitCommit;
