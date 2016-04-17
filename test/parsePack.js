var parseUploadPack = require('../lib/TransferUtils/parseUploadPack');
var parsePack = require('../lib/TransferUtils/parsePack');
var fixtures = require('./fixtures');

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
            packCount.should.equal(481);

            done();
        });
    });

});

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
            objectCount.should.equal(12545);

            done();
        });
    });

});
