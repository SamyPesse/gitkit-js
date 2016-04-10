/* eslint-disable no-console */

var Q = require('q');
var git = require('../');
var command = require('./command');

module.exports = command('branch', function(repo, args) {
    return Q.all([
        git.BranchUtils.getCurrent(repo),
        git.BranchUtils.list(repo)
    ])
        .spread(function(currentBranch, branches) {
            branches.forEach(function(branch) {
                console.log(currentBranch == branch? '*' : ' ', branch);
            });
        });
});
