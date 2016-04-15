var path = require('path');

var Git = require('../');
var NodeFS = require('../lib/fs/node');

// Create a transport instance for the GitHub repository
var transport = new Git.HTTPTransport('https://github.com/GitbookIO/gitbook.git');

// Create an FS to write the output repository
var fs = new NodeFS(path.resolve(__dirname, '../.tmp/test-clone'));

// Create a repository instance
var repo = Git.Repository.createWithFS(fs);

// Initialize the repository
Git.RepoUtils.init(repo)

    // Clone using the HTTP transport
    .then(function() {
        return Git.TransferUtils.clone(repo, transport);
    })

    .then(function() {
        console.log('Clone succeed!');
    }, function(err) {
        console.log('Clone failed:');
        console.log(err.stack || err);
    });
