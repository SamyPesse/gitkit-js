var util = require('util');
var Q = require('q');
var _ = require('lodash');
var path = require('path');

var GitData = require('./data');
var GitRef = require('./ref');
var parse = require('./utils/parse');

function GitHead(repo, name) {
    if (!(this instanceof GitHead)) return new GitHead(repo, sha);
    GitData.call(this, repo, name);

    this.name = name;
    this.ref;
}
util.inherits(GitHead, GitData);

// Read the HEAD file and parse the resolved Ref
GitHead.prototype.parse = function() {
    var that = this;

    return this.readFile()
        .then(function(content) {
            var fields = parse.map(content.toString());
            if (!fields.ref) throw new Error('Invalid ref '+that.name);

            that.ref = new GitRef(that.repo, fields.ref);
        })
        .thenResolve(this);
};

// Output as a string
GitRef.prototype.toString = function() {
    return 'ref: ' + this.ref.name + '/n';
};

// Update the head to point to a new reference
GitRef.prototype.update = function(ref) {
    var that = this;
    var name = (ref instanceof GitRef)? ref.name : ref;
    this.ref = new GitRef(that.repo, name);

    return this.writeFile(this.toString())
        .thenResolve(this);
};

module.exports = GitHead;
