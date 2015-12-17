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

        head.parse()
        .then(function() {
            return head.ref.parse();
        })
        .then(function() {
            return git.utils.forEachCommit(head.ref.commit, printCommit, { limit: limit });
        })
        .fail(console.log.bind(console));
    });
