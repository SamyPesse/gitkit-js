#!/usr/bin/env node
/* eslint-disable no-console */

import program from 'commander';

import GitKit, { Repository } from '../';
import NativeFS from '../fs/NativeFS';

import pkg from '../../package.json';

// Commands
import add from './add';
import lsTree from './ls-tree';
import lsFiles from './ls-files';
import logCommits from './log';
import branch from './branch';
import tag from './tag';
import showRef from './show-ref';
import catFile from './cat-file';
import fetch from './fetch';
import remote from './remote';
import init from './init';
import status from './status';

program.version(pkg.version).option('--debug', 'Enable error debugging');

[
    init,
    status,
    add,
    catFile,
    branch,
    tag,
    logCommits,
    lsTree,
    lsFiles,
    showRef,
    fetch,
    remote
].forEach(({ name, description, exec, options = [] }) => {
    let command = program.command(name).description(description);

    options.forEach(opt => {
        command = command.option(
            `${opt.shortcut
                ? `-${opt.shortcut}, `
                : ''}--${opt.name}${opt.type != 'boolean'
                ? ` [${opt.name}]`
                : ''}`,
            opt.description
        );
    });

    command.action((...fnargs) => {
        Promise.resolve()
            .then(() => {
                const repo = new Repository({
                    fs: new NativeFS(process.cwd())
                });
                const gitkit = new GitKit(repo);

                const args = fnargs.slice(0, -1);
                const kwargs = options.reduce((out, opt) => {
                    const value = command[opt.name];
                    const isDefined = typeof value !== 'undefined';

                    if (isDefined && opt.isRequired) {
                        throw new Error(`Parameter "${opt.name}" is required`);
                    }

                    return {
                        ...out,
                        [opt.name]: isDefined ? value : opt.default
                    };
                }, {});

                return exec(gitkit, args, kwargs);
            })
            .catch(err => {
                console.error(
                    process.env.NODE_ENV == 'development' || process.env.DEBUG
                        ? err.stack
                        : err.message
                );
                process.exit(1);
            });
    });
});

program.parse(process.argv);

if (program.args.length == 0) {
    program.help();
}
