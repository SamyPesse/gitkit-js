/** @flow */
/* eslint-disable no-console */

import type Repository from '../models/Repository';
import type Commit from '../models/Commit';

type Kwargs = {
    max: number,
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
    repo: Repository,
    [sha]: string[],
    { max }: Kwargs
): Promise<*> {
    let count = 0;

    return repo.walkCommits(sha, (commit, commitSHA) => {
        printCommit(commit, commitSHA);

        return (++count) < max;
    });
}

export default {
    name: 'log [sha]',
    exec: logCommits,
    options: [
        {
            type: 'number',
            name: 'max',
            shortcut: 'm',
            description: 'Max number of commits to log (default is 100).',
            default: 100,
        },
    ],
};
