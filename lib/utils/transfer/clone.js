var Q = require('q');
var Immutable = require('immutable');

var RepoUtils = require('../repo');
var fetchDiscovery = require('./fetchDiscovery');
var fetchRef = require('./fetchRef');
var Ref = require('../../models/ref');
var Head = require('../../models/head');

var HEAD_REFNAME = 'HEAD';

/*
    Clone a repository

    @param {Repository}
    @param {Transport}
    @return {Promise}
*/
function clone(repo, transport) {
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

        // Create the head
        var head = Head.createForRef(headRefName);

        console.log('head', headRefName, headRef.getCommit());

        return fetchRef(repo, transport, headRef, refs)

        // Write the ref
        .then(function() {
            console.log('write ref', headRefName);
            return Ref.writeToRepo(repo, headRefName, headRef);
        })

        // Write the HEAD
        .then(function() {
            console.log('write head');
            return Head.writeToRepo(repo, head);
        });
    });
}

module.exports = clone;
