var program = require('commander');
var repo = require('./repo');

program
    .command('log')
    .option('-l, --limit', 'maximum count of commits to show')
    .action(function() {
        var head = repo.Head();

        function printCommit(commit) {
            return commit.parse()
            .then(function() {
                console.log(commit.sha);
                console.log(commit.author.toString())
                console.log(commit.message);
                console.log('');
            });
        }

        head.resolve()
        .then(function(ref) {
            return ref.resolveToCommit();
        })
        .then(function(commit) {
            return printCommit(commit);
        })
        .fail(console.log.bind(console));
    });
