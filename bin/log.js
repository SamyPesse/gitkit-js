var program = require('commander');
var repo = require('./repo');

program
    .command('log')
    .option('-l, --limit [limit]', 'maximum count of commits to show')
    .action(function() {
        var head = repo.Head();
        var limit = this.limit || 10;
        var index = 0;

        function printCommit(commit) {
            index = index + 1;

            return commit.parse()
            .then(function() {
                console.log(commit.sha);
                console.log(commit.author.toString())
                console.log(commit.message);
                console.log('');

                if (commit.parents.length == 0 || index >= limit) return;
                return printCommit(commit.parents[0]);
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
