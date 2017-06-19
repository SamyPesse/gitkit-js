#!/usr/bin/env node
/* eslint-disable no-console */

import program from 'commander';

import Repository from '../models/Repository';
import NativeFS from '../fs/NativeFS';
import pkg from '../../package.json';

import lsTree from './ls-tree';

program.version(pkg.version).option('--debug', 'Enable error debugging');

[lsTree].forEach(({ name, description, exec, options = [] }) => {
    let command = program.command(name);

    options.forEach(opt => {
        command = command.option(
            `--${opt.name} [${opt.name}]`,
            opt.description
        );
    });

    command.action((...args) => {
        args = args.slice(0, -1);

        const repo = new Repository({
            fs: new NativeFS(process.cwd()),
        });

        Promise.resolve().then(() => exec(repo, args)).catch(err => {
            console.error(program.debug ? err.stack : err.message);
            process.exit(1);
        });
    });
});

if (program.parse(process.argv).args.length == 0 && process.argv.length === 2) {
    program.help();
}
