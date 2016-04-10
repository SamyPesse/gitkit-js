#!/usr/bin/env node
/* eslint-disable no-console */

var Q = require('q');
var program = require('commander');

var pkg = require('../package.json');
var git = require('../lib');
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
var repo = git.Repository.createWithFS(fs);
var log = console.log.bind(console);

program
    .option('--debug', 'Enable debugging')
    .version(pkg.version);

COMMANDS.forEach(function(command) {
    program
    .command(command.description)
    .action(function() {
        var args = Array.prototype.slice.call(arguments, 0, -1);

        Q()
        .then(function() {
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
