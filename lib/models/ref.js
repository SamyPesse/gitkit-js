var util = require('util');
var Q = require('q');
var _ = require('lodash');
var path = require('path');

var GitData = require('./data');
var GitCommit = require('./commit');
var parse = require('./utils/parse');

function GitRef(repo, name) {
    if (!(this instanceof GitRef)) return new GitRef(repo, sha);
    GitData.call(this, repo, name);

    this.name = name;
    this.commit;
}
util.inherits(GitRef, GitData);

// Read and parse the ref
GitRef.prototype.parse = function() {
    var that = this;

    return this.readFile()
        .then(function(content) {
            var sha = content.toString().trim();
            that.commit = new GitCommit(that.repo, sha);
        })
        .thenResolve(this);
};

// Update the reference
GitRef.prototype.update = function(commit) {
    var that = this;
    var sha = (commit instanceof GitCommit)? commit.sha : commit;
    this.commit = new GitCommit(that.repo, sha);

    return this.writeFile(sha)
        .thenResolve(this);
};

module.exports = GitRef;
