// @flow

var Head = require('../models/head');
import type Repository from '../models/repo';

/**
 * Get name of current branch
 *
 * @param {Repository} repo
 * @return {Promise<String>}
 */
function getCurrentBranch(repo: Repository) : Promise<string> {
    return Head.readFromRepo(repo)
        .then(function(head) {
            var refName = head.getRef();
            return refName.replace('refs/heads/', '');
        });
}

module.exports = getCurrentBranch;
