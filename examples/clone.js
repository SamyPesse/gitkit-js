/* eslint-disable no-console */
var path = require('path');

var GitKit = require('../');
var NodeFS = require('../lib/fs/node');

// Create a transport instance for the GitHub repository
var transport = new GitKit.HTTPTransport('https://github.com/GitbookIO/gitbook.git');

// Create an FS to write the output repository
var fs = new NodeFS(path.resolve(__dirname, '../.tmp/test-clone'));

// Create a repository instance
var repo = GitKit.Repository.createWithFS(fs);

// Initialize the repository
GitKit.RepoUtils.init(repo)

    // Clone using the HTTP transport
    .then(function() {
        return GitKit.TransferUtils.clone(repo, transport);
    })

    .then(
        // Success
        function() {
            console.log('Clone succeed!');
        },

        // Error
        function(err) {
            console.log('Clone failed:');
            console.log(err.stack || err);
        },

        // Progress
        function(line) {
            console.log(line.getMessage());
        }
    );
