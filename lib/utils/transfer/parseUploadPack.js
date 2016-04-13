var Buffer = require('buffer').Buffer;
var parsePktLines = require('./parsePktLines');
var parsePack = require('./parsePack');

var TYPES = {
    PACK: 1,
    PROGRESS: 2,
    ERROR: 3
};

/*
    Parse an upload result into a list of packs

    @param {Buffer}
    @return {Pack}
*/
function parseUploadPack(buf) {
    var pack = Buffer('');
    var lines = parsePktLines(buf);

    lines.forEach(function(line) {
        if (line.slice(0, 3).toString() == 'NAK') {
            return;
        }

        var type = line[0];

        if (type == TYPES.PACK) {
            pack = Buffer.concat([
                pack,
                line.slice(1)
            ]);
        }
    });

    return parsePack(pack);
}

module.exports = parseUploadPack;
