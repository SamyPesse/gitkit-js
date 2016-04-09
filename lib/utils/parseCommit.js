var parseAuthor = require('./parseAuthor');

/*
    Parse a line for an author in a commit

    @param {String} line
    @return {Object}
*/
function parseAuthorLine(line, info) {
    if (line.indexOf('author') !== -1) {
        if (info.author = parseAuthor(line.replace('author ', ''))) {
            return true;
        }
    }
    if (line.indexOf('committer') !== -1) {
        if (info.committer = parseAuthor(line.replace('committer ', ''))) {
            return true;
        }
    }

    return false;
}

/*
    Parse a commit into a map of infos

    @param {String} data
    @return {Object}
*/
function parseCommit(data) {
    var matched = '';
    var line = '';
    var commit = {
        parents: []
    };
    data = data.split('\n');

    var i = 0;

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
        return line.replace(/^ {4}/, '').replace(/\r$/, '');
    });

    commit.title = commitMessage[0];
    commit.description = commitMessage.slice(2).join('\n');

    commit.message = commit.title + (commit.description? '\n' + commit.description : '');

    return commit;
}

module.exports = parseCommit;
