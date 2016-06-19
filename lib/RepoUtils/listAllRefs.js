var FileUtils = require('../FileUtils');

/**
 * List all refs in a repository
 * @param {Repository} repo
 * @return {List<String>}
 */
function listAllRefs(repo) {
    var fs = repo.getFS();
    var baseFolder = repo.getGitPath('refs');

    return FileUtils.list(fs, baseFolder)
        .then(function(files) {
            return files.keySeq();
        });
}

module.exports = listAllRefs;
