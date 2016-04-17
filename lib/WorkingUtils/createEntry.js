var Q = require('q');
var is = require('is');
var IndexEntry = require('../models/indexEntry');
var sha1 = require('../utils/sha1');

/*
    Create an IndexEntry from a file.

    @param {Repository} repo
    @param {File|String} file
    @return {Promise<IndexEntry>}
*/
function createEntry(repo, file) {
    return Q()

    // Stat the file
    .then(function() {
        if (is.string(file)) {
            return repo.statFile(file);
        } else {
            return file;
        }
    })

    // Read file content
    .then(function(fileStat) {
        return repo.readFile(fileStat.getPath())
        .then(function(buf) {
            var sha = sha1.encode(buf);

            return new IndexEntry({
                sha: sha
            });
        });
    });
}

module.exports = createEntry;
