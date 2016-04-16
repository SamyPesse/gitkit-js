var Buffer = require('buffer').Buffer;
var varint = require('varint');

/*
    This code is mostly based on https://github.com/chrisdickinson/git-apply-delta
*/

/*
    Apply delta from packfile to a buffer.

    @param {Buffer} base
    @param {Buffer} delta
    @return {Buffer}
*/
function applyDelta(base, delta) {
    var baseSize;
    var outputSize;
    var command;
    var idx = 0, len = 0, outIdx = 0;

    var OFFSET_BUFFER = new Buffer(4);
    var LENGTH_BUFFER = new Buffer(4);

    baseSize = varint.decode(delta);
    delta = delta.slice(varint.decode.bytes);

    if (baseSize !== base.length) {
        throw new Error('Base doesn\'t match expected size: ' + baseSize + ' != '+base.length);
    }

    outputSize = varint.decode(delta);
    delta = delta.slice(varint.decode.bytes);

    var output = new Buffer(outputSize);

    // Apply deltas
    len = delta.length;

    while(idx < len) {
        command = delta[idx++];
        command & 0x80 ? copy() : insert();
    }

    function copy() {
        OFFSET_BUFFER.writeUInt32LE(0, 0);
        LENGTH_BUFFER.writeUInt32LE(0, 0);

        var check = 1, length, offset, x;

        for (x = 0; x < 4; ++x) {
            if (command & check) {
                OFFSET_BUFFER[3 - x] = delta[idx++];
            }
            check <<= 1;
        }

        for (x = 0; x < 3; ++x) {
            if (command & check) {
                LENGTH_BUFFER[3 - x] = delta[idx++];
            }
            check <<= 1;
        }
        LENGTH_BUFFER[0] = 0;

        length = LENGTH_BUFFER.readUInt32BE(0) || 0x10000;
        offset = OFFSET_BUFFER.readUInt32BE(0);

        base.copy(output, outIdx, offset, offset + length);
        outIdx += length;
    }

    function insert() {
        delta.copy(output, outIdx, idx, command + idx);
        idx += command;
        outIdx += command;
    }

    return output;
}

module.exports = applyDelta;
