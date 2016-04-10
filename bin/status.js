/* eslint-disable no-console */

var git = require('../');
var command = require('./command');

module.exports = command('status', function(repo, args) {
    return git.WorkingIndex.readFromRepo(repo)
        .then(function(index) {

        });
});
