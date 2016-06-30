// @flow

var pad = require('pad');
var is = require('is');

import type {List} from 'immutable';

/**
 * Encode a list of buffer into a buffer of pkt-lines
 *
 * @param {List<Buffer|String>}
 * @return {Buffer}
 */
function encodePktLines(lines: List<string|Buffer>) : Buffer {
    var base = new Buffer('', 'utf8');

    return lines.reduce(function(out, line) {
        var lineLength: number;

        line       = new Buffer(line, 'utf8');
        lineLength = line.length + 4;
        lineLength = pad(4, lineLength.toString(16), '0');

        return Buffer.concat([
            out,
            new Buffer(lineLength, 'utf8'),
            line
        ]);
    }, base);
}

module.exports = encodePktLines;
