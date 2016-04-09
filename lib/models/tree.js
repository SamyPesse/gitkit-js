var Immutable = require('immutable');

var TreeEntry = require('./treeEntry');

var Tree = Immutable.Record({
    entries: Immutable.OrderedMap()
});

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

module.exports = Tree;
