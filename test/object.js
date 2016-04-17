var Git = require('../');
var fixtures = require('./fixtures');

describe('Object', function() {

    describe('.createFromBuffer', function() {
        it('should read tree', function() {
            var buf = fixtures.read('object-tree');
            var obj = Git.GitObject.createFromZip(buf);

            obj.getContent().should.have.lengthOf(352);
            obj.getType().should.equal(Git.GitObject.TYPES.TREE);
        });
    });

});
