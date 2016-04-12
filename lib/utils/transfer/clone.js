var fetchDiscovery = require('./fetchDiscovery');

/*
    Clone a repository

    @param {Repository}
    @param {Transport}
    @return {Promise}
*/
function clone(repo, transport) {
    return fetchDiscovery(transport)
        .then(function(refs) {
            console.log(refs);
        });
}

module.exports = clone;
