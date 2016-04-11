/* eslint-disable no-console */

var Git = require('../');
var command = require('./command');

// WIP
module.exports = command('commit', function(repo, args, kwargs) {
    return Git.ChangesUtils.list(repo)
        .then(function(changes) {
            // Only apply tracked changes
            changes = changes.filter(function(change) {
                return change.isTracked();
            });

            return Git.CommitUtils.createForChanges(repo, author, message, changes);
        });
}, [
    {
        name: 'message',
        shortcut: 'm',
        description: 'Message for the commit',
        required: true
    }
]);
