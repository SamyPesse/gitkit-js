var pako = require('pako');
var Dissolve = require('dissolve');
var GitObject = require('../../models/object');
var BufferUtils = require('../buffer');

var TYPES = {
    COMMIT: 1,
    TREE: 2,
    BLOB: 3,
    TAG: 4,
    OFS_DELTA: 6,
    REF_DELTA: 7
};

/*
    Parse header of an object entry

    @param {Dissolve}
    @return {Dissolve}
*/
function parseObjectHeader(parser) {
    return parser.uint8be('byte')
    .tap(function() {
        var byte = this.vars.byte;
        var left = 4;

        this.vars.type = (byte >> 4) & 7;
        this.vars.size = byte & 0xf;

        this.loop(function(end) {
            if (!(this.vars.byte & 0x80)) {
                return end();
            }

            this.uint8be('byte')
            .tap(function() {
                this.vars.size |= (this.vars.byte & 0x7f) << left;
                left += 7;
            });
        })
        .tap(function() {
            this.vars.size = this.vars.size >>> 0;
            console.log('get type', this.vars.type, 'with size', this.vars.size);
        });
    });
}

/*
    Parse an object entry

    @param {Dissolve}
    @return {Dissolve}
*/
function parseObject(parser) {
    return parseObjectHeader(parser)
    .tap(function() {
        var inflator = new pako.Inflate();

        this.loop(function(end) {
            this.buffer('byte', 1)
            .tap(function() {
                var byte = this.vars.byte;

                var ab = new Uint8Array(1);
                ab.fill(byte[0]);

                inflator.push(ab);

                if (inflator.ended) {
                    if (inflator.err) {
                        this.emit('error', new Error(inflator.msg));
                    }

                    this.vars.content = BufferUtils.fromUint8Array(inflator.result);

                    end();
                }
            });
        });
    })
    .tap(function() {
        var expectSize = this.vars.size;
        var resultSize = this.vars.content.length;

        if (resultSize !== expectSize) {
            return this.emit('error', new Error('Size mismatch'));
        }
    });
}

/*
    Parse a packfile

    @return {Stream<GitObject>}
*/
function parsePack() {
    return Dissolve()
    .string('signature', 4)
    .uint32be('version')
    .uint32be('count')
    .tap(function() {
        var header = this.vars;

        // Check header
        if (header.signature !== 'PACK') {
            this.emit('error', new Error('Invalid pack signature'));
            return;
        }

        var objectCount = 0;

        this.loop(function(endObjectLoop) {

            parseObject(this)
            .tap(function() {
                var buf = this.vars.content;
                var type = this.vars.type;
                var objectType;


                if (type == TYPES.COMMIT) {
                    objectType = GitObject.TYPES.COMMIT;
                } else if (type == TYPES.BLOB) {
                    objectType = GitObject.TYPES.BLOB;
                } else if (type == TYPES.TREE) {
                    objectType = GitObject.TYPES.TREE;
                } else {
                    throw new Error('Unknow type: ' + type);
                }

                // Emit GitObject
                var obj = new GitObject({
                    type: objectType,
                    content: buf
                });
                console.log('-> sha:', objectType, obj.getSha());
                console.log('');
                this.emit('data', obj);

                if (objectCount++ === header.count) {
                    return endObjectLoop(true);
                }
            });
        });
    });
}

module.exports = parsePack;
