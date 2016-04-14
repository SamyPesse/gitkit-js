var intoStream = require('into-stream');
var assert = require('assert');
var parsePktLines = require('../lib/utils/transfer/parsePktLines');

var data = [
    '0007hi\n',
    '0032want 0000000000000000000000000000000000000000\n',
    '0000',
    '001bhi\0ofs-delta hat party\n',
    'PACK0123456678999'
];

var expect = [
    {size:3, data:'hi\n', type:'pkt-line', caps:null},
    {size:0x2e, data:'want 0000000000000000000000000000000000000000\n', type:'pkt-line', caps:null},
    {size:0, data:null, type:'pkt-flush', caps:null},
    {size:3, data:'hi\n', type:'pkt-line', caps:['ofs-delta', 'hat', 'party']},
    {size:17, data:'PACK0123456678999', type:'packfile', caps:['ofs-delta', 'hat', 'party']}
];

describe('parsePktLines', function() {
    it('should output all lines', function() {
        var lineIdx = 0;

        intoStream(data)
        .pipe(parsePktLines())
        .on('data', function(buf) {
            assert.equal(buf.toString('utf8'), expect[lineIdx].data);

            lineIdx++;
        });
    });
});
