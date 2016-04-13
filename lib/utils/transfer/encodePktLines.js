var pad = require('pad');
var is = require('is');
var Buffer = require('buffer').Buffer;

/*
    Encode a list of buffer into a buffer of pkt-lines

    @param {List<Buffer|String>}
    @return {Buffer}
*/
function encodePktLines(lines) {
    return lines.reduce(function(out, line) {
        if (is.string(line)) {
            line = new Buffer(line, 'utf8');
        }

        var lineLength = line.length + 4;
        lineLength = pad(4, lineLength.toString(16), '0');

        return Buffer.concat([
            out,
            new Buffer(lineLength, 'utf8'),
            line
        ]);
    }, Buffer(''));
}

module.exports = encodePktLines;
