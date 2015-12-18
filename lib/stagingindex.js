var util = require('util');

var GitData = require('./data');

function GitStagingIndex(repo, name) {
    if (!(this instanceof GitStagingIndex)) return new GitStagingIndex(repo, sha);
    GitData.call(this, repo, name);
}
util.inherits(GitStagingIndex, GitData);


module.exports = GitStagingIndex;
