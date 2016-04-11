/* eslint-disable no-console */

var Git = require('../');
var command = require('./command');

module.exports = command('init', function(repo, args) {
    repo = repo.set('bare', false);

    return Git.RepoUtils.init(repo);
});
