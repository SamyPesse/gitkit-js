var git = require('../');
var command = require('./command');

module.exports = command('ls-tree [sha]', function(repo, args) {
    var sha = args[0];

    return git.Tree.readFromRepo(repo, sha)
        .then(function(tree) {

        });
});
