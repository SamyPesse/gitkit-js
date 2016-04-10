/* eslint-disable no-console */

var git = require('../');
var command = require('./command');

function printBlob(blob) {
    console.log(blob.getContent().toString('utf8'));
}

function printTree(tree) {
    var entries = tree.getEntries();

    entries.forEach(function(entry) {
        console.log(entry.getMode() + ' ' +
            entry.getType() + ' ' +
            entry.getSha() + '\t' +
            entry.getPath());
    });
}

function printCommit(commit) {
    var parents = commit.getParents();

    console.log('tree', commit.getTree());

    parents.forEach(function(parent) {
        console.log('parent', parent);
    });

    console.log('author', commit.getAuthor().toString());
    console.log('committer', commit.getCommitter().toString());
    console.log('');
    console.log(commit.getMessage());
}

module.exports = command('cat-file [sha]', function(repo, args) {
    var sha = args[0];

    return git.GitObject.readFromRepo(repo, sha)
        .then(function(obj) {
            if (obj.isBlob()) {
                printBlob(git.Blob.createFromObject(obj));
            } else if (obj.isTree()) {
                printTree(git.Tree.createFromObject(obj));
            } else if (obj.isCommit()) {
                printCommit(git.Commit.createFromObject(obj));
            } else {
                throw new Error('Unknow object type');
            }
        });
});
