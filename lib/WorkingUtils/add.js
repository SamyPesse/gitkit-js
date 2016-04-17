var Q = require('q');
var Immutable = require('immutable');

var WorkingIndex = require('../models/workingIndex');
var createEntry = require('./createEntry');

/*
    Add a file to the working index. It's equivalent to "git add"

    @param {Repository} repo
    @param {File|String} file
    @return {Promise}
*/
function addToIndex(repo, file) {
    return Q.all([
        // Read current working index
        WorkingIndex.readFromRepo(repo),

        // Prepare new entry for this file
        createEntry(repo, file)
    ])
    .spread(function(workingIndex, newEntry) {
        var entries = workingIndex.getEntries();
        var currentEntry = entries.get(newEntry.getPath());

        // Nothing changed?
        if (Immutable.is(currentEntry, newEntry)) {
            return workingIndex;
        }

        // Add entry
        entries = entries.set(newEntry.getPath(), newEntry);

        workingIndex = workingIndex.set('entries', entries);

        // Write file for index
        return WorkingIndex.writeToRepo(repo, workingIndex);
    });
}

module.exports = addToIndex;
