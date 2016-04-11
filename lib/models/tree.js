var is = require('is');
var Immutable = require('immutable');

var TreeEntry = require('./treeEntry');
var GitObject = require('./object');
var parseTree = require('../utils/parseTree');

var Tree = Immutable.Record({
    entries: Immutable.OrderedMap()
});

Tree.prototype.getEntries = function() {
    return this.get('entries');
};


/*
    Parse a tree from a Buffer

    @param {Buffer} content
    @return {Tree}
*/
Tree.createFromBuffer = function(content) {
    var entries = parseTree(content);
    var entriesMap = {};

    entries.forEach(function(entry) {
        entriesMap[entry.path] = new TreeEntry(entry);
    });

    return new Tree({
        entries: Immutable.OrderedMap(entriesMap)
    });
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
    Create a tree using a list of entries

    @param {Array<TreeEntry>|List<TreeEntry>} arr
    @return {Tree}
*/
Tree.create = function(arr) {
    if (!is.array(arr)) arr = arr.toJS();

    return new Tree({
        entries: Immutable.OrderedMap(arr.map(function(entry) {
            return [entry.getPath(), entry];
        }))
    });
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
