// @flow

var FileUtils = require('../FileUtils');

import type Repository from '../models/repo';
import type {List} from 'immutable';

/**
 * List all refs in a repository
 * @param {Repository} repo
 * @return {List<String>}
 */
function listAllRefs(
    repo: Repository
): List<string> {
    var fs = repo.getFS();
    var baseFolder = repo.getGitPath('refs');

    return FileUtils.list(fs, baseFolder)
        .then(function(files) {
            return files.keySeq();
        });
}

module.exports = listAllRefs;
