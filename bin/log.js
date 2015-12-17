var program = require('commander');

var git = require('../');
var repo = require('./repo');

program
    .command('log')
    .option('-l, --limit [limit]', 'maximum count of commits to show')
    .action(function() {
        var head = repo.Head();
        var limit = this.limit || 10;

        function printCommit(commit) {
            console.log(commit.sha);
            console.log(commit.author.toString())
            console.log(commit.message);
            console.log('');
        }

        head.resolve()
        .then(function(ref) {
            return ref.resolveToCommit();
        })
        .then(function(base) {
            return git.utils.forEachCommit(base, printCommit, { limit: limit });
        })
        .fail(console.log.bind(console));
    });
