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
}
util.inherits(GitRef, GitData);

// Read and return the sha
GitRef.prototype.read = function() {
    var that = this;

    return this.readFile()
        .then(function(content) {
            return content.toString().trim();
        });
};

// Return a corresponding commit
GitRef.prototype.resolveToCommit = function() {
    var that = this;

    return this.read()
        .then(function(sha) {
            return new GitCommit(that.repo, sha);
        });
};

module.exports = GitRef;
