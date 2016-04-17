
/*
    Add an entry to an existing tree

    @param {Tree}
    @param {TreeEntry}
    @return {Tree}
*/
function addEntry(tree, entry) {
    var entries = tree.getEntries();

    entries = entries.set(
        entry.getPath(),
        entry
    );

    return tree.set('entries', entries);
}

module.exports = addEntry;
