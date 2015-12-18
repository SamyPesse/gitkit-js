#!/usr/bin/env node

var _ = require('lodash');
var program = require('commander');

var pkg = require('../package.json');
var git = require('../lib');
var FS = require('../lib/fs/node');

var fs = new FS(process.cwd());
var repo = new git.Repo(fs);

var log = console.log.bind(console);

program
    .version(pkg.version);

_.each(git.commands, function(command, name) {
    program
    .command(command.description)
    .action(function() {
        command(repo, [], {})
        .fail(log);
    })
});

program.parse(process.argv);
