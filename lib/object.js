var util = require('util');
var Q = require('q');
var _ = require('lodash');
var path = require('path');

var GitData = require('./data');

var buffer = require('./utils/buffer');
var sha1 = require('./utils/sha1');

function GitObject(repo, sha) {
    if (!(this instanceof GitObject)) return new GitObject(repo, sha);
    GitData.call(this, repo);

    this.sha = sha;
    this.type = 'object';
}
util.inherits(GitObject, GitData);

// Return path to the data file
GitObject.prototype.path = function() {
    return this.repo.gitPath('objects', this.sha.slice(0, 2), this.sha.slice(2));
};

// Read content of the git object
GitObject.prototype.read = function() {
    var that = this;
    if (!this.sha) return Q.reject(new Error('This object doesn\'t have a sha'));

    return this.readFile()
        .then(buffer.unzip)
        .then(function(content) {
            var nullChar = content.indexOf(0);

            // Parse object header
            var header = content.slice(0, nullChar).toString();
            that.type = _.first(header.split(' '));

            // Extract content
            return content.slice(nullChar + 1);
        });
};

// Write this object and update its sha
GitObject.prototype.create = function(buf) {
    var that = this;

    // Accept string/arraybuffer/buffer as entry
    buf = buffer.enforce(buf);

    // Calcul sha1 for the buffer
    this.sha = sha1.encode(buf);

    // Zip the buffer
    return buffer.zip(buf)

        // Write the corresponding file
        .then(function(zipBuffer) {
            return that.writeFile(zipBuffer);
        })

        .thenResolve(that);
};

module.exports = GitObject;
