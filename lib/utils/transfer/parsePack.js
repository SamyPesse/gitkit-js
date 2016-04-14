var through = require('through2');
var binary = require('binary');
var zlib = require('zlib');

var GitObject = require('../../models/object');

var TYPES = {
    COMMIT: 1,
    TREE: 2,
    BLOB: 3,
    TAG: 4,
    OFS_DELTA: 6,
    REF_DELTA: 7
};

/*
    Parse a packfile

    @return {Stream<GitObject>}
*/
function parsePack() {
    var parse = binary()
        .buffer('signature', 4)
        .word32bu('version')
        .word32bu('count')
        .tap(function(header) {
            // Check header
            if (header.signature.toString('utf8') !== 'PACK') {
                output.emit('error', new Error('Invalid pack signature'));
            }
        })
        .loop(function() {
            this.word8bu('byte')

        });


    var output = through(function(data, enc, callback) {
        parse.write(data);
        callback();
    });

    return output;



    var objects = [];
    var header = binary.parse(buf)
        .buffer('signature', 4)
        .word32bu('version')
        .word32bu('count')
        .vars;

    // Check header
    if (header.signature.toString('utf8') !== 'PACK') {
        throw new Error('Invalid pack signature');
    }

    buf = buf.slice(12);

    function peek(n) {
        var out = buf.slice(0, n);
        buf = buf.slice(n);

        return out;
    }

    function peekObject() {
        var byte = peek(1).readUInt8(0);
        var isMsbSet = byte & 0x80;

        var type = (byte >> 4) & 7;
        var size;

        if (isMsbSet) {
            size = byte & 15;
            var shift = 4;

            while (byte & 0x80) {
                byte = peek(1).readUInt8(0);
                size += (byte & 0x7f) << shift;
                shift += 7;
            }
        } else {
            size = byte & 0x0F;
        }

        var objectBuf = peek(size);
        var objectType;

        // Determine type
        if (type == TYPES.COMMIT) {
            objectType = GitObject.TYPES.COMMIT;
        } else if (type == TYPES.TREE) {
            objectType = GitObject.TYPES.TREE;
        } else if (type == TYPES.BLOB) {
            objectType = GitObject.TYPES.BLOB;
        }

        console.log('get object of type', objectType)

        // Decompress content
        objectBuf = zlib.inflateSync(objectBuf);

        var obj = new GitObject({
            type: objectType,
            content: objectBuf
        });
        console.log('-> sha:', obj.getSha());

        objects.push(obj);
    }

    for (var i = 0; i < header.count; i++) {
        peekObject();
    }

    return new Immutable.List(objects);
}

module.exports = parsePack;
