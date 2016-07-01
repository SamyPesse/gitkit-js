// @flow

var RepoUtils = require('../RepoUtils');
var fetch = require('./fetch');

import type Repository from '../models/repo';
import type Transport from '../transport/base';

/**
 * Clone a repository.
 * See http://stackoverflow.com/a/16428258
 *
 * @param {Repository}
 * @param {Transport}
 * @return {Promise}
 */
function clone(repo: Repository, transport: Transport, opts: Object|fetch.Options = {}) : Promise {
    return fetch(repo, transport, opts)

    // Finally checkout master
    .then(function(ref) {
        if (repo.isBare()) {
            return;
        }

        return RepoUtils.checkout(repo, ref);
    });
}

module.exports = clone;
