var iterate = require('../utils/iterate');

function log(repo, args, opts) {
    var head = repo.Head();
    var limit = opts.limit || 10;

    function printCommit(commit) {
        console.log(commit.sha);
        console.log(commit.author.toString())
        console.log(commit.message);
        console.log('');
    }

    return head.parse()
    .then(function() {
        return head.ref.parse();
    })
    .then(function() {
        return iterate.forEachCommit(head.ref.commit, printCommit, { limit: limit });
    })
}

module.exports = log;
module.exports.description = 'log'
module.exports.options = {
    limit: {
        description: 'Maximum number of commits to list',
        default: 10
    }
};
