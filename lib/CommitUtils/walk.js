var Q = require('q');
var Commit = require('../models/commit');

/*
    Iterate over commits, stop when iter returns false

    @param {Repository}
    @param {String} base
    @param {Function(sha, commit, depth)} iter
*/
function walk(repo, base, iter, depth) {
    depth = depth || 0;


    return Commit.readFromRepo(repo, base)
    .then(function(commit) {
        if (iter(base, commit, depth) === false) {
            return;
        }

        var parents = commit.getParents();

        return parents.reduce(function(prev, parent, i) {
            return prev.then(function() {
                return walk(repo, parent, iter, depth + i);
            });
        }, Q());
    });
}

module.exports = walk;
