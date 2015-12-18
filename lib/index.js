var _ = require('lodash');
var Q = require('q');

var GitRepo = require('./repo');
var GitCommit = require('./commit');
var GitTree = require('./tree');
var GitBlob = require('./blob');
var GitData = require('./data');
var GitObject = require('./object');
var GitStagingIndex = require('./stagingindex');
var Author = require('./author');


module.exports = {
    Repo: GitRepo,
    Commit: GitCommit,
    Tree: GitTree,
    Blob: GitBlob,
    Data: GitData,
    Object: GitObject,
    Author: Author,
    StagingIndex: GitStagingIndex,

    commands: require('./commands'),
    iterate: require('./utils/iterate')
};
