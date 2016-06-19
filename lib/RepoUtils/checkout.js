var Q = require('q');
var TreeUtils = require('../TreeUtils');
var Commit = require('../models/commit');
var Ref = require('../models/ref');
var Blob = require('../models/blob');
var Head = require('../models/head');
var ProgressLine = require('../models/progressLine');


/*
    To do for checkout:

    - Write all blob for the commit's tree to working dir
        - Write content
        - Update file's stat
    - Recreate workingIndex
*/


/**
 * Checkout a tree, for each entry, write it to the repo
 *
 * @param {Repository}
 * @param {String}
 * @return {Promise}
 */
function checkoutTree(repo, treeSHA) {
    if (repo.isBare()) {
        return Q.reject(new Error('Can\'t checkout in a bare repository'));
    }

    var d = Q.defer();

    TreeUtils.walk(repo, treeSHA, function(filename, entry) {
        var sha = entry.getSha();

        d.notify(
            ProgressLine.WriteFile(filename)
        );

        // Read the blob
        return Blob.readFromRepo(repo, sha)

        // Write it as a file
        .then(function(blobContent) {
            return repo.writeFile(filename, blobContent);
        })

        // TODO: edit stat of file
        .then(function() {

        });
    })

    // Update working index
    .then(function() {
        // todo
    })

    // Resolve
    .then(d.resolve, d.reject);

    return d.promise;
}

/**
 * Checkout a commit|ref
 *
 * @param {Repository}
 * @param {String} refName
 * @return {Promise}
 */
function checkout(repo, refName) {
    if (repo.isBare()) {
        return Q.reject(new Error('Can\'t checkout in a bare repository'));
    }

    // Read ref
    return Ref.readFromRepo(repo, refName)
    .then(function(ref) {
        return Commit.readFromRepo(repo, ref.getCommit());
    })

    // Update the working tree
    .then(function(commit) {
        return checkoutTree(repo, commit.getTree());
    })

    // Update HEAD
    .then(function() {
        var head = Head.createForRef(refName);
        return Head.writeToRepo(repo, head);
    });
}


module.exports = checkout;
