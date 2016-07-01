// @flow

import type Tree from '../models/tree';
import type TreeEntry from '../models/treeEntry';

/**
 * Add an entry to an existing tree
 * @param {Tree}
 * @param {TreeEntry}
 * @return {Tree}
 */
function addEntry(tree: Tree, entry: TreeEntry) : Tree {
    var entries = tree.getEntries();

    entries = entries.set(
        entry.getPath(),
        entry
    );

    return tree.set('entries', entries);
}

module.exports = addEntry;
