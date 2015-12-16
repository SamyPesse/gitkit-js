var path = require('path');

var buffer = require('./buffer');

function GitObject(repo, sha) {
    if (!(this instanceof GitObject)) return new GitObject(repo);

    this.repo = repo;
    this.sha = sha;
    this.content;
}

// Return path to the object
GitObject.prototype.path = function() {
    return path.join('.git/objects', this.sha.slice(0, 2), this.sha.slice(2));
};

// Read content of the git object
GitObject.prototype.read = function() {
    var that = this;

    return this.repo.readFile(this.path())
        .then(buffer.unzip)
        .then(function(content) {
            that.content = content;
            return that;
        });
};

module.exports = GitObject;
