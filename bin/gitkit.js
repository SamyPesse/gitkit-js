#!/usr/bin/env node
/* eslint-disable no-console */

var Q = require('q');
var is = require('is');
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
    require('./commit'),
    require('./add'),
    require('./init')
];

var fs = new FS(process.cwd());

program
    .option('--debug', 'Enable debugging')
    .version(pkg.version);

COMMANDS.forEach(function(command) {
    var cmd = program.command(command.description);

    command.options.forEach(function(opt) {
        cmd = cmd.option('--'+opt.name+' ['+opt.name+']', opt.description);
    });

    cmd.action(function() {
        var args = Array.prototype.slice.call(arguments, 0, -1);
        var kwargs;

        Q()
        .then(function() {
            kwargs = command.options.reduce(function(out, opt) {
                out[opt.name] = command.options[opt.name];

                if (is.undefined(out[opt.name]) && opt.required) {
                    throw new Error('Parameter "' + opt.name + '" is required');
                }

                return out;
            }, {});

            return Git.RepoUtils.prepare(fs);
        })
        .then(function(repo) {
            return command.exec(repo, args, kwargs);
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
