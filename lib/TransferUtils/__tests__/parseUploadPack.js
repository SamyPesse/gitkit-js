var parseUploadPack = require('../parseUploadPack');

describe('parseUploadPack', function() {
    this.timeout(3000000);

    it('should output all lines', function(done) {
        var objectCount = 0;

        fixtures.createReadStream('pack-http-output')
        .pipe(parseUploadPack())
        .on('data', function() {
            objectCount++;
        })
        .on('error', function(err) {
            done(err);
        })
        .on('finish', function() {
            expect(objectCount).toBe(12545);

            done();
        });
    });
});
