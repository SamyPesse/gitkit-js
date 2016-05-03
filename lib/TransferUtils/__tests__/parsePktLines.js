var intoStream = require('into-stream');

var parsePktLines = require('../parsePktLines');
var parsePktLineMeta = require('../parsePktLineMeta');

var data = [
    '001bhi\0ofs-delta hat party\n',
    '0007hi\n',
    '0032want 0000000000000000000000000000000000000000\n',
    '0000'
];

var results = [
    {data:'hi\n', type:'pkt-line', caps:['ofs-delta', 'hat', 'party']},
    {data:'hi\n', type:'pkt-line', caps:['ofs-delta', 'hat', 'party']},
    {data:'want 0000000000000000000000000000000000000000\n', type:'pkt-line', caps:['ofs-delta', 'hat', 'party']},
    {data:'', type:'pkt-flush', caps:['ofs-delta', 'hat', 'party']}
];

describe('parsePktLines and parsePktLineMeta', function() {
    it('should output all lines', function(done) {
        var lineIdx = 0;

        intoStream(data)
        .pipe(parsePktLines())
        .pipe(parsePktLineMeta())
        .on('data', function(line) {
            var expectLine = results[lineIdx];

            expect(line.toString('utf8')).toBe(expectLine.data);
            expect(line.type).toBe(expectLine.type);
            expect(line.caps).toEqual(expectLine.caps);

            lineIdx++;
        })
        .on('finish', function() {
            expect(lineIdx).toBe(results.length);

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
            expect(count).toBe(425);

            done();
        });
    });
});

