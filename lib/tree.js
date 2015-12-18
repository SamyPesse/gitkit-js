var util = require('util');
var _ = require('lodash');

var GitObject = require('./object');
var GitBlob = require('./blob');

var parse = require('./utils/parse');

function GitTree(repo, sha) {
    if (!(this instanceof GitTree)) return new GitTree(repo, sha);
    GitObject.apply(this, arguments);

    this.entries = {};
}
util.inherits(GitTree, GitObject);

// Parse the tree
GitTree.prototype.parse = function() {
    var that = this;

    return this.read()
        .then(function(content) {
            var match;
            var str = content.toString();
            var re = /(\d+) (.*?)\0(.{20})/g;

            while (match = re.exec(str)) {
                var mode = match[1];
                var filename = match[2];
                var sha = (new Buffer(match[3])).toString('hex');
                var type = mode == '00'? 'tree' : 'blob';

                that.entries[filename] = {
                    mode: mode,
                    sha: sha,
                    type: type,
                    object: type == 'tree'? new GitTree(that.repo, sha)
                        : new GitBlob(that.repo, sha)
                };
            }
        })
        .thenResolve(this);
};


// Convert tree entries to string
GitTree.prototype.toString = function() {
    // todo
};

module.exports = GitTree;
