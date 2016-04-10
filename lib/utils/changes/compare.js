var Immutable = require('immutable');
var Change = require('../../models/change');

/*
    Compare the working index and the current state of the repository.

    @param {WorkingIndex} workingIndex
    @param {OrderedMap<String:File>} files
    @return {OrderedMap<String:Change>}
*/
function compareChanges(workingIndex, files) {
    var changes = Immutable.OrderedMap();
    var entries = workingIndex.getEntries();

    // Entry not tracked
    files.forEach(function(file) {
        var filePath = file.getPath();
        var entry = entries.get(filePath);

        if (entry) return;

        changes = changes.set(
            filePath,
            Change.createForFile(Change.TYPES.UNTRACKED, file)
        );
    });

    return changes;
}


module.exports = compareChanges;
