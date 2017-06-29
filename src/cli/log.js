/** @flow */
/* eslint-disable no-console */

import type GitKit, { Commit } from '../';

type Kwargs = {
    max: number
};

/*
 * Print a commit.
 */
function printCommit(commit: Commit, sha: string) {
    console.log(`commit ${sha}`);
    console.log(`Author: ${commit.author.name} <${commit.author.email}>`);

    if (commit.author.email != commit.committer.email) {
        console.log(
            `Committer: ${commit.author.name} <${commit.author.email}>`
        );
    }

    console.log(`\n\t${commit.message}\n`);
}

/*
 * Log the commits history
 */
function logCommits(
    gitkit: GitKit,
    args: string[],
    { max }: Kwargs
): Promise<*> {
    let count = 0;

    return gitkit.readHEAD().then(() => gitkit.indexRefs()).then(() => {
        const { headCommit } = gitkit.repo;

        return gitkit.walkCommits(headCommit, (commit, commitSHA) => {
            printCommit(commit, commitSHA);

            count += 1;
            return count < max;
        });
    });
}

export default {
    name: 'log',
    description: 'Show commit logs',
    exec: logCommits,
    options: [
        {
            type: 'number',
            name: 'max',
            shortcut: 'm',
            describe: 'Max number of commits to log (default is 100).',
            default: 100
        }
    ]
};
