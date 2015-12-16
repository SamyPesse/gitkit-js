var util = require('util');
var Q = require('q');
var _ = require('lodash');
var path = require('path');

var GitData = require('./data');

function GitRef(repo, name) {
    if (!(this instanceof GitRef)) return new GitRef(repo, sha);
    GitData.call(this, repo, name);

    this.name = name;
}
util.inherits(GitRef, GitData);

// Read content of the git ref
GitRef.prototype.parse = function() {
    var that = this;

    return this.readFile()
        .then(function(content) {
            console.log(content.toString());
        })
        .thenResolve(this);
};

module.exports = GitRef;
