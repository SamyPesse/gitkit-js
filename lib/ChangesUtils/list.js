var Promise = require('q');
var WorkingIndex = require('../models/workingIndex');
var FileUtils = require('../FileUtils');
var compareChanges = require('./compare');

/**
 * Compare the working index and the current state of the repository.
 *
 * @param {Repository} repo
 * @param {}
 * @return {Promsie<OrderedMap<String:Change>>}
 */
function listChanges(repo) {
    return Promise.all([
        WorkingIndex.readFromRepo(repo),
        FileUtils.listAll(repo)
    ])
    .spread(compareChanges);
}


module.exports = listChanges;
