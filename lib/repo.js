var _ = require('lodash');
var path = require('path');

var buffer = require('./utils/buffer');
var GitObject = require('./object');
var GitCommit = require('./commit');
var GitRef = require('./ref');
var GitHead = require('./head');

function GitRepo(fs, opts) {
    if (!(this instanceof GitRepo)) return new GitRepo(fs);

    this.fs = fs;
    this.opts = _.defaults(opts || {}, {
        bare: false
    });
}

/// Relations constructor
GitRepo.prototype.Object = function(sha) {
    return (new GitObject(this, sha));
};
GitRepo.prototype.Commit = function(sha) {
    return (new GitCommit(this, sha));
};
GitRepo.prototype.Ref = function(name) {
    return (new GitRef(this, name));
};
GitRepo.prototype.Head = function(name) {
    return (new GitHead(this, name || 'HEAD'));
};

// Return path to a file inside the .git folder
GitRepo.prototype.gitPath = function gitPath(filePath) {
    if (this.opts.bare) return filePath;
    var args = _.toArray(arguments);

    return path.join.apply(path,['.git'].concat(args));
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
