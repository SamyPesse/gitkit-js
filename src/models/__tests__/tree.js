var GitObject = require('../object');
var Tree = require('../tree');

describe('Tree', function() {
    it('.createFromBuffer', function() {
        var buf = fixtures.read('object-tree');

        var obj = GitObject.createFromZip(buf);
        var tree = Tree.createFromBuffer(obj.getContent());

        var entries = tree.getEntries();
        expect(entries.size).toBe(10);
    });
});
