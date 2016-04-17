var Git = require('../');
var fixtures = require('./fixtures');

describe('Tree', function() {

    it('.createFromBuffer', function() {
        var buf = fixtures.read('object-tree');

        var obj = Git.GitObject.createFromZip(buf);
        var tree = Git.Tree.createFromBuffer(obj.getContent());

        var entries = tree.getEntries();
        entries.size.should.equal(10);
    });

});
