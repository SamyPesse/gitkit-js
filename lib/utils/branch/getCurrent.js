var Head = require('../../models/head');

/*
    Get name of current branch

    @param {Repository} repo
    @return {String}
*/
function getCurrentBranch(repo) {
    return Head.readFromRepo(repo)
        .then(function(head) {
            var refName = head.getRef();
            return refName.replace('refs/heads/', '');
        });
}

module.exports = getCurrentBranch;
