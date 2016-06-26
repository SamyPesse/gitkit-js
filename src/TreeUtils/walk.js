var Promise = require('q');
var path = require('path');
var Tree = require('../models/tree');

/**
 * Iterate over all tree entries
 * @param {Repository}
 * @param {String} base
 * @param {Function(filepath, entry)} iter
 */
function walk(repo, base, iter, baseName) {
    baseName = baseName || '';

    return Tree.readFromRepo(repo, base)
    .then(function(tree) {
        var entries = tree.getEntries();

        return entries.reduce(function(prev, entry, filename) {
            return prev.then(function() {
                var completeFilename = path.join(baseName, filename);

                if (!entry.isTree()) {
                    return iter(completeFilename, entry);
                } else {
                    return walk(repo, entry.getSha(), iter, completeFilename);
                }
            });
        }, Promise());
    });
}

module.exports = walk;
