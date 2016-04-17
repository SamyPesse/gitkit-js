var Q = require('q');
var TreeUtils = require('../TreeUtils');
var Commit = require('../models/commit');
var Ref = require('../models/ref');
var Blob = require('../models/blob');
var ProgressLine = require('../models/progressLine');


/*
    To do for checkout:

    - Write all blob for the commit's tree to working dir
        - Wirte content
        - Update file's stat
    - Recreate workingIndex
*/


/*
    Checkout a tree, for each entry, write it to the repo

    @param {Repository}
    @param {String}
    @return {Promise}
*/
function checkoutTree(repo, treeSHA) {
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
    .then(d.resolve, d.reject);

    return d.promise;
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

    return Commit.readFromRepo(repo, commitSHA)
    .then(function(commit) {
        return checkoutTree(repo, commit.getTree());
    });
}


module.exports = checkout;
