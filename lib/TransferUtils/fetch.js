var Q = require('q');
var Immutable = require('immutable');

var RepoUtils = require('../RepoUtils');
var fetchDiscovery = require('./fetchDiscovery');
var fetchRef = require('./fetchRef');
var Ref = require('../models/ref');
var Head = require('../models/head');

var HEAD_REFNAME = 'HEAD';

var FetchOptions = Immutable.Record({
    // Name of the remote
    remoteName: String('origin')
});


/*
    Fetch a repository

    @param {Repository}
    @param {Transport}
    @return {Promise}
*/
function fetch(repo, transport, opts) {
    opts = FetchOptions(opts);

    return Q.all([
        // Fetch the list of refs and capabilities of the server
        fetchDiscovery(transport),

        // List refs we have
        RepoUtils.getAllRefs(repo)
    ])
    .spread(function(discovery, refs) {
        var availableRefs = discovery.refs;

        // Find HEAD commit
        var headCommit = availableRefs.get(HEAD_REFNAME);

        // Find name of HEAD ref
        var headRefName = availableRefs.findKey(function(ref, refName) {
            return (
                refName != HEAD_REFNAME &&
                Immutable.is(ref, headCommit)
            );
        });
        var headRef = discovery.refs.get(headRefName);

        return fetchRef(repo, transport, headRef, refs)

        // Write the ref
        .then(function() {
            return Ref.writeToRepo(repo, headRefName, headRef);
        });
    });
}

module.exports = fetch;
