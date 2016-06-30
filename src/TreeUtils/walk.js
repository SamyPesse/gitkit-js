// @flow

var Promise = require('q');
var path = require('path');
var Tree = require('../models/tree');

import type Repository from '../models/repo';
import type TreeEntry from '../models/treeEntry';
type IterFunction = (name: string, entry: TreeEntry) => any;

/**
 * Iterate over all tree entries
 * @param {Repository}
 * @param {String} base
 * @param {Function(filepath, entry)} iter
 */
function walk(repo: Repository, base: string, iter: IterFunction, baseName: string = '') : Promise {
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
