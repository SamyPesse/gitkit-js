/* eslint-disable no-console */

var git = require('../');
var command = require('./command');

module.exports = command('log', function(repo, args) {
    var MAX = 100;
    var i = 0;

    function logCommit(sha, commit, depth) {
        i++;

        console.log(sha);
        console.log(commit.getAuthor().toString());
        console.log(commit.getMessage());
        console.log('');

        if (i >= MAX) return false;
    }

    return git.Head.readFromRepo(repo)
        .then(function(head) {
            var refName = head.getRef();
            return git.Ref.readFromRepo(repo, refName);
        })
        .then(function(ref) {
            var baseSHA = ref.getCommit();
            return git.CommitUtils.walk(repo, baseSHA, logCommit);
        });
});
