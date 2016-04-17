var pako = require('pako');
var Dissolve = require('dissolve');
var uint8ToBuffer = require('typedarray-to-buffer');

var GitObject = require('../models/object');
var applyDelta = require('./applyDelta');

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
    @return {Dissolve<type,size>}
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
        });
    });
}

/*
    Parse inflate content for blob, commit and tree.
    Also index the content for this specific index.

    @param {Dissolve}
    @return {Dissolve<content>}
*/
function parseInflateContent(parser) {
    var inflator = new pako.Inflate();

    // Iterate while we found end of zip content
    return parser.loop(function(end) {
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

                this.vars.content = uint8ToBuffer(inflator.result);

                end();
            }
        });
    });
}

/*
    Parse a REF delta

    @param {Dissolve}
    @return {Dissolve}
*/
function parseRefDelta(parser) {
    return parser.string('ref', 20)
    .then(function() {
        throw new Error('Not yet implemented');
    });
}

/*
    Parse OFS delta's header

    @param {Dissolve}
    @return {Dissolve}
*/
function parseOFSDeltaHeader(parser) {
    return parser.uint8be('byte')
    .tap(function() {
        var byte = this.vars.byte;

        this.vars.rv = byte & 0x7f;

        this.loop(function(end) {
            if (!(this.vars.byte & 0x80)) {
                return end();
            }

            this.uint8be('byte')
            .tap(function() {
                this.vars.rv++;
                this.vars.rv <<= 7;
                this.vars.rv |= this.vars.byte & 0x7f;
            });
        });
    });
}

/*
    Parse OFS delta, apply delta and return with vars "type" and "content"

    @param {Dissolve}
    @return {Dissolve<content>}
*/
function parseOFSDelta(parser) {
    return parseOFSDeltaHeader(parser)
    // Extract delta content
    .tap(function() {
        parseInflateContent(this);
    })

    // Apply delta to content
    .tap(function() {
        var rv = this.vars.rv;
        var baseOffset = this.vars.objectOffset;
        var offset = baseOffset - rv;

        // Get referenced type/content
        var base = this.gitContentIndex[offset];
        var type = this.gitObjectTypes[offset];

        if (base) {
            // Apply delta on content
            var delta = this.vars.content;
            var output = applyDelta(base, delta);

            // Export as variables
            this.vars.content = output;
            this.vars.type = type;
        } else {
            throw new Error('Content for ref is not indexed');
        }
    });
}

/*
    Parse an object entry

    @param {Dissolve}
    @return {Dissolve<content>}
*/
function parseObject(parser) {
    return parser.tap(function() {
        this.vars = {
            objectOffset: this.offset
        };

        parseObjectHeader(parser);
    })
    .tap(function() {
        if (this.vars.type < 5) {
            parseInflateContent(this);
        } else if (this.vars.type === TYPES.OFS_DELTA) {
            parseOFSDelta(this);
        } else if (this.vars.type === TYPES.REF_DELTA) {
            parseRefDelta(this);
        } else {
            return this.emit('error', new Error('Invalid entry type in pack'));
        }
    })

    // Index content for this offset
    // todo: index content by sha for REF_DELTA
    .tap(function() {
        var objectOffset = this.vars.objectOffset;

        this.gitObjectTypes = this.gitObjectTypes || {};
        this.gitContentIndex = this.gitContentIndex || {};

        this.gitObjectTypes[objectOffset] = this.vars.type;
        this.gitContentIndex[objectOffset] = this.vars.content;
    });
}

/*
    Parse a packfile

    @return {Stream<GitObject>}
*/
function parsePack(opts) {
    return Dissolve({
        objectMode: true
    })
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

        if (opts && opts.onCount) {
            opts.onCount(header.count);
        }

        var objectCount = 0;

        this.loop(function(endObjectLoop) {
            parseObject(this)
            .tap(function() {
                var buf = this.vars.content;
                var type = this.vars.type;

                if (!type || !buf) return;

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

                this.emit('data', obj);
            })
            .tap(function() {
                objectCount++;

                if (objectCount === header.count) {
                    return endObjectLoop();
                }
            });
        });
    });
}

module.exports = parsePack;
