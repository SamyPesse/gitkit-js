var util = require('util');
var Q = require('q');
var _ = require('lodash');
var path = require('path');

var buffer = require('./buffer');
var GitData = require('./data');

function GitObject(repo, sha) {
    if (!(this instanceof GitObject)) return new GitObject(repo, sha);
    GitData.call(this, repo, path.join('objects', sha.slice(0, 2), sha.slice(2)));

    this.sha = sha;
    this.type = 'object';
    this.content;
}
util.inherits(GitObject, GitData);

// Read content of the git object
GitObject.prototype.read = function() {
    var that = this;
    if (this.content) return Q(this.content);

    return this.readFile()
        .then(buffer.unzip)
        .then(function(content) {
            var nullChar = content.indexOf(0);

            // Parse object header
            var header = content.slice(0, nullChar).toString();
            that.type = _.first(header.split(' '));

            // Extract content
            that.content = content.slice(nullChar + 1);
        })
        .thenResolve(this);
};

module.exports = GitObject;
