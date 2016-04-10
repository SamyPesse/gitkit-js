var Immutable = require('immutable');

var TreeEntry = require('./treeEntry');
var GitObject = require('./object');

var Tree = Immutable.Record({
    entries: Immutable.OrderedMap()
});

Tree.prototype.getEntries = function() {
    return this.get('entries');
};

/*
    Parse a tree from a String

    @param {String} content
    @return {Tree}
*/
Tree.createFromString = function(content) {
    var match;
    var entries = {};
    var re = /(\d+) (.*?)\0(.{20})/g;

    while (match = re.exec(content)) {
        var mode = match[1];
        var filename = match[2];
        var sha = (new Buffer(match[3])).toString('hex');
        var type = mode == '00'? 'tree' : 'blob';

        entries[filename] = new TreeEntry({
            mode: mode,
            sha: sha,
            type: type
        });
    }

    return new Tree({
        entries: Immutable.OrderedMap(entries)
    });
};


/*
    Parse a tree from a Buffer

    @param {Buffer} content
    @return {Tree}
*/
Tree.createFromBuffer = function(content) {
    return Tree.createFromString(content.toString('utf8'));
};

/*
    Parse a tree from a GitObject

    @param {GitObject} obj
    @return {Tree}
*/
Tree.createFromObject = function(obj) {
    return Tree.createFromBuffer(obj.getContent());
};

/*
    Read a tree object by its sha from a repository

    @param {Repository} repo
    @param {String} sha
    @return {Promise<Tree>}
*/
Tree.readFromRepo = function(repo, sha) {
    return GitObject.readFromRepo(repo, sha)
        .then(function(obj) {
            if (!obj.isTree()) {
                throw new Error('Object "' + sha + '" is not a tree');
            }

            return Tree.createFromObject(obj);
        });
};

module.exports = Tree;
