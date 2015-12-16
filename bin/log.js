var program = require('commander');
var repo = require('./repo');

program
    .command('log')
    .action(function() {
        var head = repo.Head();

        head.parse()

    });
