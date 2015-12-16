var Q = require('q');
var _ = require('lodash');
var path = require('path');

var buffer = require('./buffer');

function GitObject(repo, sha) {
    if (!(this instanceof GitObject)) return new GitObject(repo, sha);

    this.repo = repo;
    this.sha = sha;
    this.type = 'object';
    this.content;
}

// Return path to the object
GitObject.prototype.path = function() {
    return path.join('.git/objects', this.sha.slice(0, 2), this.sha.slice(2));
};

// Read content of the git object
GitObject.prototype.read = function() {
    var that = this;
    if (this.content) return Q(this.content);

    return this.repo.readFile(this.path())
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
