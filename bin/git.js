#!/usr/bin/env node
/* eslint-disable no-console */

var Q = require('q');
var program = require('commander');

var pkg = require('../package.json');
var git = require('../lib');
var FS = require('../lib/fs/node');

var COMMANDS = [
    require('./log'),
    require('./ls-tree')
];

var fs = new FS(process.cwd());
var repo = git.Repository.createWithFS(fs);
var log = console.log.bind(console);

program
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
        .fail(log);
    });
});

if(program.parse(process.argv).args.length == 0 && process.argv.length === 2) {
    program.help();
}
