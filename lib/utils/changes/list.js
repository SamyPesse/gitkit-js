var Q = require('q');
var WorkingIndex = require('../../models/workingIndex');
var FileUtils = require('../file');
var compareChanges = require('./compare');

/*
    Compare the working index and the current state of the repository.

    @param {Repository} repo
    @param {}
    @return {OrderedMap<String:Change>}
*/
function listChanges(repo) {
    return Q.all([
        WorkingIndex.readFromRepo(repo),
        FileUtils.listAll(repo)
    ])
    .spread(compareChanges);
}


module.exports = listChanges;
