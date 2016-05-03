var parsePack = require('../parsePack');

describe('parsePack', function() {
    it('should output all objects', function(done) {
        var packCount = 0;

        fixtures.createReadStream('pack')
        .pipe(parsePack())
        .on('data', function(line) {
            packCount++;
        })
        .on('error', function(err) {
            done(err);
        })
        .on('finish', function() {
            expect(packCount).toBe(481);

            done();
        });
    });
});
