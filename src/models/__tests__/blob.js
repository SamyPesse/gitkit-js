var Blob = require('../blob');

describe('Blob', function() {
    describe('.createFromString', function() {
        it('should create a blob', function() {
            var blob = Blob.createFromString('Hello World');
            expect(blob).toBeA(Blob);
        });
    });
});

