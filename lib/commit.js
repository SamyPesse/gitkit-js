var util = require('util');

var GitObject = require('./object');
var Author = require('./author');

function GitCommit(repo, sha) {
    if (!(this instanceof GitCommit)) return new GitCommit(repo, sha);
    GitObject.apply(this, arguments);
}
util.inherits(GitCommit, GitObject);

// Parse infos about the commit
GitCommit.prototype.parse = function() {
    var that = this;

    return this.read()
        .then(function() {
            _.extend(that, GitCommit.parse(that.content.toString()));
        })
        .thenResolve(this);
};


// Parse a commit into a map of infos
GitCommit.parse = function(data) {
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
        } else if (!parseAuthors(line, commit) && /^\s+(\S.+)/.exec(line)) {
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
};

module.exports = GitCommit;
