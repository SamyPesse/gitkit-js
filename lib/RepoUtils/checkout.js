var Q = require('q');
var TreeUtils = require('../TreeUtils');
var Commit = require('../models/commit');
var Ref = require('../models/ref');

/*
    Checkout a tree

    @param {Repository}
    @param {String}
    @return {Promise}
*/
function checkoutTree(repo, treeSHA) {
    return TreeUtils.walk(repo, treeSHA, function(filename, entry) {

    });
}

/*
    Checkout a commit|ref

    @param {Repository}
    @param {String|Ref}
    @return {Promise}
*/
function checkout(repo, commitSHA) {
    if (repo.isBare()) {
        return Q.reject(new Error('Can\'t checkout in a bare repository'));
    }

    if (commitSHA instanceof Ref) {
        commitSHA = commitSHA.getCommit();
    }

    return Commit.readFromRepo(commitSHA)
    .then(function(commit) {
        return checkoutTree(repo, commit.getTree());
    });
}


module.exports = checkout;
