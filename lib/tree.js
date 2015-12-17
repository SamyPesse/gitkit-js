var util = require('util');
var _ = require('lodash');

var GitObject = require('./object');
var parse = require('./utils/parse');

function GitTree(repo, sha) {
    if (!(this instanceof GitTree)) return new GitTree(repo, sha);
    GitObject.apply(this, arguments);
}
util.inherits(GitTree, GitObject);

module.exports = GitTree;
