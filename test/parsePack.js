var parseUploadPack = require('../lib/utils/transfer/parseUploadPack');
var parsePack = require('../lib/utils/transfer/parsePack');
var fixtures = require('./fixtures');

describe('parsePack', function() {
    it('should output all objects', function(done) {
        var packCount = 0;

        fixtures.createReadStream('pack')
        .pipe(parsePack())
        .on('data', function(line) {
            packCount++;
        })
        .on('finish', function() {
            packCount.should.equal(481);

            done();
        });
    });

});

describe('parseUploadPack', function() {
    this.timeout(30000);

    it('should output all lines', function(done) {
        var packCount = 0;

        fixtures.createReadStream('pack-http-output')
        .pipe(parseUploadPack())
        .on('data', function(line) {
            packCount++;
        })
        .on('finish', function() {
            packCount.should.equal(10);

            done();
        });
    });

});
