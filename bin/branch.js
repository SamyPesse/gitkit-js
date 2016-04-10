/* eslint-disable no-console */

var Q = require('q');
var Git = require('../');
var command = require('./command');

module.exports = command('branch', function(repo, args) {
    return Q.all([
        Git.BranchUtils.getCurrent(repo),
        Git.BranchUtils.list(repo)
    ])
        .spread(function(currentBranch, branches) {
            branches.forEach(function(branch) {
                console.log(currentBranch == branch? '*' : ' ', branch);
            });
        });
});
