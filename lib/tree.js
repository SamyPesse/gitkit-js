var util = require('util');
var _ = require('lodash');

var GitObject = require('./object');
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

                that.entries[filename] = {
                    mode: mode,
                    sha: sha,
                    type: mode == '00'? 'tree' : 'blob'
                };
            }
        })
        .thenResolve(this);
};

module.exports = GitTree;
