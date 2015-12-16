var Q = require('q');
var _ = require('lodash');
var path = require('path');

function GitData(repo, innerPath) {
    if (!(this instanceof GitData)) return new GitData(repo, innerPath);

    this.innerPath = innerPath;
    this.repo = repo;
}

// Return path to the data file
GitData.prototype.path = function() {
    return path.join('.git/', this.innerPath);
};

// Read content of the file
GitData.prototype.readFile = function() {
    return this.repo.readFile(this.path());
};

// Write the git data
GitData.prototype.writeFile = function(buf) {
    return this.repo.writeFile(this.path(), buf)
        .thenResolve(this);
};

module.exports = GitData;
