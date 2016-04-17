var Head = require('../models/head');
var Ref = require('../models/ref');

/*
    Get head commit for a repository

    @param {Repository}
    @return {Promise<String>}
*/
function getHead(repo) {
    return Head.readFromRepo(repo)
        .then(function(head) {
            var refName = head.getRef();
            return Ref.readFromRepo(repo, refName);
        })
        .then(function(ref) {
            return ref.getCommit();
        });
}

module.exports = getHead;
