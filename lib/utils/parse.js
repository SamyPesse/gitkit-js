var _ = require('lodash');

var AUTHOR_RE = /(.*) <([^>]+)> (\d+) ([+-]{1}\d{4})/;


// Parse a map
// Exemple: .git/HEAD or .git/refs/remotes/origin/HEAD
function parseMap(str) {
    var o = {};

    _.each(str.split('/n'), function(line) {
        var parts = line.split(':');
        if (parts.length == 1) return;

        o[parts[0]] = parts.slice(1).join(':').trim();
    });

    return o;
}

// Parse an author
function parseAuthor(str) {
    var match = AUTHOR_RE.exec(str);
    if (!match) return null;

    return {
        name: match[1].replace(/(^\s+|\s+$)/, ''),
        email: match[2],
        timestamp: parseInt(match[3], 10),
        timezone: match[4]
    };
}

// Parse a line for an author in a commit
function parseAuthorLine(line, info) {
    if (line.indexOf('author') !== -1) {
        if (info.author = parseHuman(line.replace('author ', ''))) {
            return true;
        }
    }
    if (line.indexOf('committer') !== -1) {
        if (info.committer = parseHuman(line.replace('committer ', ''))) {
            return true;
        }
    }

    return false;
}

// Parse a commit into a map of infos
function parseCommit(data) {
    var matched = '';
    var line = '';
    var commit = {
        parents: [],
    };
    data = data.split('\n');

    var i = 0;
    var len = data.length;

    // parse commit data
    while (line = data[i].trim()) {
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
    var commitMessage = data.slice(i + 1).map(function(line) {
        // remove 'git spaces' from the beginning of each line
        return line.replace(/^    /, '').replace(/\r$/, '');
    });

    commit.title = commitMessage[0];
    commit.description = commitMessage.slice(2).join('\n');

    return commit;
}

module.exports = {
    map: parseMap,
    author: parseAuthor,
    commit: parseCommit
};
