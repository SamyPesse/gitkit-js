#!/usr/bin/env node
/* eslint-disable no-console */

var program = require('commander');

var pkg = require('../package.json');
var Git = require('../lib');
var FS = require('../lib/fs/node');

var COMMANDS = [
    require('./log'),
    require('./ls-tree'),
    require('./ls-files'),
    require('./cat-file'),
    require('./branch'),
    require('./status'),
    require('./add')
];

var fs = new FS(process.cwd());

program
    .option('--debug', 'Enable debugging')
    .version(pkg.version);

COMMANDS.forEach(function(command) {
    program
    .command(command.description)
    .action(function() {
        var args = Array.prototype.slice.call(arguments, 0, -1);

        Git.RepoUtils.prepare(fs)
        .then(function(repo) {
            return command.exec(repo, args, {});
        })
        .fail(function(err) {
            console.error(program.debug? err.stack : err.message);
            process.exit(1);
        });
    });
});

if(program.parse(process.argv).args.length == 0 && process.argv.length === 2) {
    program.help();
}
