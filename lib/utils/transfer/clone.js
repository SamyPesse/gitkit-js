var Q = require('q');

var RepoUtils = require('../repo');
var fetchDiscovery = require('./fetchDiscovery');

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
        console.log(refs);
    });
}

module.exports = clone;
