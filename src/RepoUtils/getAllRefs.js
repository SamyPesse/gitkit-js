// @flow

var Promise = require('q');
var Immutable = require('immutable');

var listAllRefs = require('./listAllRefs');
var Ref = require('../models/ref');

import type Repository from '../models/repo';

/**
 * Get all refs in a repository
 *
 * @param {Repository} repo
 * @return {OrderedMap<String:Ref>}
 */
function getAllRefs(
    repo: Repository
): Promise {
    return listAllRefs(repo)
        .then(function(refs) {
            var base = new Immutable.OrderedMap();

            return refs.reduce(function(prev, refName) {
                return prev
                    .then(function(out) {
                        return Ref.readFromRepoByName(repo, refName)
                        .then(function(ref) {
                            return out.set(refName, ref);
                        });
                    });

            }, Promise(base));
        });
}

module.exports = getAllRefs;
