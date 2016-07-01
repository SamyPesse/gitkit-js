// @flow

var Immutable = require('immutable');
var Change = require('../models/change');
var File = require('../models/file');

import type WorkingIndex from '../models/workingIndex';

/**
 * Compare the working index and the current state of the repository.
 *
 * @param {WorkingIndex} workingIndex
 * @param {OrderedMap<String:File>} files
 * @return {OrderedMap<String:Change>}
 */
function compareChanges(
    workingIndex: WorkingIndex,
    files: Immutable.OrderedMap<string,File>
): Immutable.OrderedMap<string,Change>  {
    var changes = [];
    var entries = workingIndex.getEntries();

    // Files not present in the index: UNTRACKED
    files.forEach(function(file) {
        var filePath = file.getPath();
        var entry    = entries.get(filePath);
        if (entry) {
            return;
        }

        changes.push([
            filePath,
            Change.createForFile(Change.TYPES.UNTRACKED, file)
        ]);
    });

    // Entries no longer present in the folder
    entries.forEach(function(entry) {
        var entryPath = entry.getPath();
        var file      = files.get(entryPath);
        if (file) {
            return;
        }

        changes.push([
            entryPath,
            Change.createForFile(
                Change.TYPES.REMOVED,
                File.createFromIndexEntry(entry)
            )
        ]);
    });

    return Immutable.OrderedMap(changes);
}

module.exports = compareChanges;
