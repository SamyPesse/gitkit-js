var FileUtils = require('../FileUtils');

/*
    List branches in a repository

    @param {Repository} repo
    @return {List<String>}
*/
function listBranches(repo) {
    var fs = repo.getFS();
    var baseFolder = repo.getGitPath('refs/heads');

    return FileUtils.list(fs, baseFolder)
        .then(function(files) {
            return files.keySeq();
        });
}

module.exports = listBranches;
