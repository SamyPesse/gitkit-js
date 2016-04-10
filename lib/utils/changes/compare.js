var Immutable = require('immutable');
var Change = require('../../models/change');
var File = require('../../models/file');

/*
    Compare the working index and the current state of the repository.

    @param {WorkingIndex} workingIndex
    @param {OrderedMap<String:File>} files
    @return {OrderedMap<String:Change>}
*/
function compareChanges(workingIndex, files) {
    var changes = Immutable.OrderedMap();
    var entries = workingIndex.getEntries();

    // Files not present in the index: UNTRACKED
    files.forEach(function(file) {
        var filePath = file.getPath();
        var entry = entries.get(filePath);
        if (entry) return;

        changes = changes.set(
            filePath,
            Change.createForFile(Change.TYPES.UNTRACKED, file)
        );
    });

    // Entries no longer present in the folder
    entries.forEach(function(entry) {
        var entryPath = entry.getPath();
        var file = files.get(entryPath);
        if (file) return;

        changes = changes.set(
            entryPath,
            Change.createForFile(
                Change.TYPES.REMOVED,
                File.createFromIndexEntry(entry)
            )
        );
    });

    return changes;
}


module.exports = compareChanges;
