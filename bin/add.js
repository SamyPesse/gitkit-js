var git = require('../');
var command = require('./command');

module.exports = command('add [file]', function(repo, args) {
    var filePath = args[0];

    return git.WorkingUtils.add(repo, filePath);
});
