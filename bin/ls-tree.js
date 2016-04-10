var git = require('../');
var command = require('./command');

module.exports = command('ls-tree [sha]', function(repo, args) {
    var sha = args[0];

    function logEntry(filePath, entry) {
        console.log(entry.getMode(), entry.getType(), entry.getSha(), filePath);
    }

    return git.TreeUtils.walk(repo, sha, logEntry);
});
