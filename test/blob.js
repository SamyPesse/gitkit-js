var Git = require('../');

describe('Blob', function() {

    describe('.createFromString', function() {
        it('should create a blob', function() {
            var blob = Git.Blob.createFromString('Hello World');
            blob.should.be.an.instanceOf(Git.Blob);
        });
    });

});

