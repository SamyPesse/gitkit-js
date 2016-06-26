// @flow

var FileUtils = require('../FileUtils');

import type {List} from 'immutable';
import type Repository from '../models/repo';

/**
 * List branches in a repository
 *
 * @param {Repository} repo
 * @return {Promise<List<String>>}
 */
function listBranches(repo: Repository) : Promise<List<string>> {
    var fs = repo.getFS();
    var baseFolder = repo.getGitPath('refs/heads');

    return FileUtils.list(fs, baseFolder)
        .then(function(files) {
            return files.keySeq();
        });
}

module.exports = listBranches;
