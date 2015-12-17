var util = require('util');
var _ = require('lodash');

var GitObject = require('./object');

function GitBlob(repo, sha) {
    if (!(this instanceof GitBlob)) return new GitBlob(repo, sha);
    GitObject.apply(this, arguments);
}
util.inherits(GitBlob, GitObject);

module.exports = GitBlob;
