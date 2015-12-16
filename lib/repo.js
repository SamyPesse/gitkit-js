var _ = require('lodash');

var buffer = require('./buffer');
var GitObject = require('./object');
var GitCommit = require('./commit');

function GitRepo(fs) {
    if (!(this instanceof GitRepo)) return new GitRepo(fs);

    this.fs = fs;
}

// Return a git object in this repo
GitRepo.prototype.object = function(sha) {
    return (new GitObject(this, sha));
};

// Return a commit by its sha
GitRepo.prototype.commit = function(sha) {
    return (new GitCommit(this, sha));
};

// Read a file from the associated fs
GitRepo.prototype.readFile = function readFile(filePath) {
    return this.fs.read(filePath)
        .then(buffer.enforce);
};

// Write a file in the associated fs
GitRepo.prototype.writeFile = function writeFile(filePath, buf) {
    return this.fs.write(filePath, buffer.enforce(buf));
};

// Delete a file in the fs
GitRepo.prototype.unlinkFile = function unlinkFile(filePath) {
    return this.fs.unlink(filePath);
};

module.exports = GitRepo;
