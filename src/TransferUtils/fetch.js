// @flow

var Promise = require('q');
var Immutable = require('immutable');

var RepoUtils = require('../RepoUtils');
var fetchDiscovery = require('./fetchDiscovery');
var fetchRef = require('./fetchRef');
var Ref = require('../models/ref');

import type Repository from '../models/repo';
import type Transport from '../transport/base';

const HEAD_REFNAME = 'HEAD';

class FetchOptions extends Immutable.Record({
    // Name of the remote
    remoteName: String('origin')
}) {}

/**
 * Fetch a repository
 *
 * @param {Repository}
 * @param {Transport}
 * @return {Promise}
 */
function fetch(repo: Repository, transport: Transport, opts: FetchOptions|Object = {}) : Promise {
    opts = FetchOptions(opts);

    return Promise.all([
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
module.exports.Options = FetchOptions;
