var should = require('should');
var intoStream = require('into-stream');

var parsePktLines = require('../lib/utils/transfer/parsePktLines');
var parsePktLineMeta = require('../lib/utils/transfer/parsePktLineMeta');
var fixtures = require('./fixtures');

var data = [
    '001bhi\0ofs-delta hat party\n',
    '0007hi\n',
    '0032want 0000000000000000000000000000000000000000\n',
    '0000'
    //'PACK0123456678999'
];

var expect = [
    {data:'hi\n', type:'pkt-line', caps:['ofs-delta', 'hat', 'party']},
    {data:'hi\n', type:'pkt-line', caps:['ofs-delta', 'hat', 'party']},
    {data:'want 0000000000000000000000000000000000000000\n', type:'pkt-line', caps:['ofs-delta', 'hat', 'party']},
    {data:'', type:'pkt-flush', caps:['ofs-delta', 'hat', 'party']}
    //{size:17, data:'PACK0123456678999', type:'packfile', caps:['ofs-delta', 'hat', 'party']}
];

describe('parsePktLines and parsePktLineMeta', function() {
    it('should output all lines', function(done) {
        var lineIdx = 0;

        intoStream(data)
        .pipe(parsePktLines())
        .pipe(parsePktLineMeta())
        .on('data', function(line) {
            var expectLine = expect[lineIdx];

            line.toString('utf8').should.equal(expectLine.data);
            line.type.should.equal(expectLine.type);
            should(line.caps).deepEqual(expectLine.caps);

            lineIdx++;
        })
        .on('finish', function() {
            lineIdx.should.equal(expect.length);

            done();
        });
    });

    it('should parse line from a discovery', function(done) {
        var count = 0;

        fixtures.createReadStream('discovery-http-output')
        .pipe(parsePktLines())
        .on('data', function(buf) {
            count++;
        })
        .on('finish', function() {
            count.should.equal(425);

            done();
        });
    });
});

