/* eslint-disable no-console */

var color = require('bash-color');

var Git = require('../');
var command = require('./command');

var TRACKED = 'tracked';
var UNTRACKED = 'untracked';

module.exports = command('status', function(repo, args) {
    return Git.ChangesUtils.list(repo)
        .then(function(changes) {
            var groups = changes.groupBy(function(change) {
                return (change.isTracked()? TRACKED : UNTRACKED);
            });

            if (groups.has(TRACKED)) {
                console.log('Changes not staged for commit:');

                groups.get(TRACKED).forEach(function(change) {
                    var type = change.getType();
                    var file = change.getFile();

                    console.log('\t', color.red( type + ':\t' + file.getPath()));
                });

                console.log('');
            }

            if (groups.has(UNTRACKED)) {
                console.log('Untracked files:');

                groups.get(UNTRACKED).forEach(function(change) {
                    var file = change.getFile();

                    console.log('\t', color.red(file.getPath()));
                });

                console.log('');
            }
        });
});
