var Q = require('q');

var RepoUtils = require('../repo');
var fetchDiscovery = require('./fetchDiscovery');
var fetchRef = require('./fetchRef');

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
        var first = discovery.refs.first();

        return fetchRef(repo, transport, first, refs);
    });
}

module.exports = clone;
