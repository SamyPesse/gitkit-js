#!/usr/bin/env node
/* eslint-disable no-console */

import program from 'commander';

import Repository from '../models/Repository';
import NativeFS from '../fs/NativeFS';
import pkg from '../../package.json';

import lsTree from './ls-tree';
import logCommits from './log';
import branch from './branch';
import showRef from './show-ref';

program.version(pkg.version).option('--debug', 'Enable error debugging');

[branch, logCommits, lsTree, showRef].forEach(({ name, description, exec, options = [] }) => {
    let command = program
        .command(name)
        .description(description);

    options.forEach(opt => {
        command = command.option(
            `${opt.shortcut
                ? '-' + opt.shortcut + ', '
                : ''}--${opt.name}${opt.type != 'boolean'
                ? ' [' + opt.name + ']'
                : ''}`,
            opt.description
        );
    });

    command.action((...args) => {
        Promise.resolve()
            .then(() => {
                const repo = new Repository({
                    fs: new NativeFS(process.cwd()),
                });

                args = args.slice(0, -1);
                const kwargs = options.reduce((out, opt) => {
                    const value = command[opt.name];
                    const isDefined = typeof value !== 'undefined';
                    out[opt.name] = isDefined ? value : opt.default;

                    if (isDefined && opt.isRequired) {
                        throw new Error(`Parameter "${opt.name}" is required`);
                    }

                    return out;
                }, {});

                return exec(repo, args, kwargs);
            })
            .catch(err => {
                console.error(program.debug ? err.stack : err.message);
                process.exit(1);
            });
    });
});

program.parse(process.argv);

if (program.args.length == 0) {
    program.help();
}
