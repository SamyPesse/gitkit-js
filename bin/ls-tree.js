/* eslint-disable no-console */

var git = require('../');
var command = require('./command');

function printEntry(filePath, entry) {
    console.log(entry.getMode(), entry.getType(), entry.getSha(), filePath);
}

module.exports = command('ls-tree [sha]', function(repo, args) {
    var sha = args[0];

    return git.TreeUtils.walk(repo, sha, printEntry);
});
