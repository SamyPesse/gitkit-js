// var Tree = require('../models/tree');

/**
 * Apply changes to a tree
 * @param {Repository}
 * @param {String}
 * @param {Map<String:Change>} changes
 * @return newTreeSha
 */
function applyChanges(repo, treeSha, changes) {
    /* var toApply = changes.filter(function(change, filePath) {
        var parts = filePath.split('/');
        return parts.length === 1;
    });


    return Tree.readFromRepo(repo, treeSha)
        .then(function(tree) {
            var entries = tree.getEntries();

            // TODO
        }); */
}

module.exports = applyChanges;
