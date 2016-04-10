/* eslint-disable no-console */

var git = require('../');
var command = require('./command');

function printEntry(entry) {
    console.log(
        '' + entry.getMode(),
        entry.getSha(),
        entry.getPath()
    );
}

module.exports = command('ls-files', function(repo, args) {
    return git.WorkingIndex.readFromRepo(repo)
        .then(function(workingIndex) {
            var entries = workingIndex.getEntries();
            entries.forEach(printEntry);
        });
});
