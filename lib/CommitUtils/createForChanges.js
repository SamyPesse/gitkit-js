var Head = require('../models/head');
var Commit = require('../models/commit');
var Ref = require('../models/ref');
var TreeUtils = require('../tree');

/*
    Create a new tree and commit for changes.

    @param {Tree}
    @param {Author}
    @param {String} message
    @param {Map<String:TreeEntry>} entries
    @return {String}
*/
function createForChanges(repo, author, message, changes) {
    var parent, currentRefPath;

    // Get current commit
    return Head.readFromRepo(repo)
        .then(function(head) {
            currentRefPath = head.getRef();
            return Ref.readFromRepo(repo, currentRefPath);
        })

        .then(function(ref) {
            parent = ref.getCommit();

            return Commit.readFromRepo(repo, parent);
        })

        // Write new tree
        .then(function(commit) {
            return TreeUtils.applyChanges(repo, commit.getTree(), changes);
        })

        // Create the new commit
        .then(function(treeSha) {
            var commit = Commit.create({
                author: author,
                committer: author,
                message: message,
                parents: [parent],
                tree: treeSha
            });

            // Write the commit in the reposirory
            return Commit.writeToRepo(repo, commit);
        })

        // Update the reference
        .then(function(commitSha) {
            var ref = Ref.createForCommit(commitSha);

            // Write the reference
            return Ref.writeToRepo(repo, currentRefPath, ref);
        });
}

module.exports = createForChanges;
