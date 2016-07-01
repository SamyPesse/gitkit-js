var GitObject = require('../object');

describe('Object', function() {
    describe('.createFromBuffer', function() {
        it('should read tree', function() {
            var buf = fixtures.read('object-tree');
            var obj = GitObject.createFromZip(buf);

            expect(obj.getContent().length).toBe(352);
            expect(obj.getType()).toBe(GitObject.TYPES.TREE);
        });
    });
});
