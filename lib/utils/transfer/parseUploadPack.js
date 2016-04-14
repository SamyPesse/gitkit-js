var through = require('through2');
var combine = require('stream-combiner2');

var parsePktLines = require('./parsePktLines');
var parsePack = require('./parsePack');

var TYPES = {
    PACK: 1,
    PROGRESS: 2,
    ERROR: 3
};

/*
    Parse an upload result into a list of packs

    @return {Stream<GitObject>}
*/
function parseUploadPack() {
    var output = through(function(line, enc, callback) {
        if (line.slice(0, 3).toString() == 'NAK') {
            return callback();
        }

        var type = line[0];
        if (type == TYPES.PACK) {
            output.write(line.slice(1));
        }

        callback();
    });

    return combine(
        // Parse as lines
        parsePktLines(),

        // Filter packs
        output,

        // Parse pack as objects
        parsePack()
    );
}

module.exports = parseUploadPack;
