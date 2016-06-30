// @flow

var parseAuthor = require('./parseAuthor');
import type AuthorDetails from './parseAuthor';

export type SvnRepo = {
    repo: string,
    rev:  number,
    uuid: string
};

export type CommitDetails = {
    author:      ?AuthorDetails,
    committer:   ?AuthorDetails,
    parents:     Array<string>,
    tree:        string,
    svn:         ?SvnRepo,
    message:     string,
    title:       string,
    description: string
};

/**
 * Parse a line for an author in a commit
 *
 * @param {String} line
 * @param {Object} info
 * @return {Boolean}
 */
function parseAuthorLine(line: string, info: CommitDetails) : boolean {
    if (line.indexOf('author') !== -1) {
        info.author = parseAuthor(line.replace('author ', ''));
        if (info) {
            return true;
        }
    }

    if (line.indexOf('committer') !== -1) {
        info.committer = parseAuthor(line.replace('committer ', ''));
        if (info.committer) {
            return true;
        }
    }

    return false;
}

/**
 * Parse a commit into a map of infos
 *
 * @param {String} data
 * @return {Object}
 */
function parseCommit(data: string) : CommitDetails {
    var matched = '';
    var line = '';
    var commit: CommitDetails = {
        parents:     [],
        title:       '',
        message:     '',
        description: '',
        tree:        '',
        svn:         undefined,
        author:      undefined,
        committer:   undefined
    };
    var lines = data.split('\n');
    var i = 0;

    // parse commit data
    while (line = lines[i].trim()) {
        if (!commit.tree && (matched = line.match(/^tree ([0-9a-fA-F]{40})$/))) {
            commit.tree = matched[1];
        } else if (matched = line.match(/^parent ([0-9a-fA-F]{40})$/)) {
            commit.parents.push(matched[1]);
        } else if (matched = /^\s+git\-svn\-id:\s(.+)$/.exec(line)) {
            var svn = matched[1].split(/[@\s]/);
            commit.svn = {
                repo : svn[0],
                rev : Number(svn[1]),
                uuid : svn[2]
            };
        } else if (!parseAuthorLine(line, commit) && /^\s+(\S.+)/.exec(line)) {
            // empty line means commit message begins
            break;
        }

        i++;
    }

    // slicing from i + 1 to to remove the \n at the beginning of the commit title
    var commitMessage = lines.slice(i + 1).map(function(line) {
        // remove 'git spaces' from the beginning of each line
        return line.replace(/^ {4}/, '').replace(/\r$/, '');
    });

    commit.title       = commitMessage[0];
    commit.description = commitMessage.slice(2).join('\n');
    commit.message     = commit.title + (commit.description? '\n' + commit.description : '');

    return commit;
}

module.exports = parseCommit;
