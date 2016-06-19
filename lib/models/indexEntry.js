var Immutable = require('immutable');
var Concentrate = require('concentrate');
var Dissolve = require('dissolve');
var Buffer = require('buffer').Buffer;

var IndexEntry = Immutable.Record({
    ctime:          Date(),
    mtime:          Date(),
    dev:            Number(),
    ino:            Number(),
    mode:           Number(),
    uid:            Number(),
    gid:            Number(),
    entrySize:      Number(),
    flags:          Number(),
    extendedFlags:  Number(),
    sha:            String(),
    path:           String()
});

IndexEntry.prototype.getDev = function() {
    return this.get('dev');
};

IndexEntry.prototype.getIno = function() {
    return this.get('ino');
};

IndexEntry.prototype.getUid = function() {
    return this.get('uid');
};

IndexEntry.prototype.getGid = function() {
    return this.get('gid');
};

IndexEntry.prototype.getCTime = function() {
    return this.get('ctime');
};

IndexEntry.prototype.getMTime = function() {
    return this.get('mtime');
};

IndexEntry.prototype.getMode = function() {
    return this.get('mode');
};

IndexEntry.prototype.getPath = function() {
    return this.get('path');
};

IndexEntry.prototype.getSha = function() {
    return this.get('sha');
};

IndexEntry.prototype.getFlags = function() {
    return this.get('flags');
};

IndexEntry.prototype.getExtendedFlags = function() {
    return this.get('extendedFlags');
};

IndexEntry.prototype.getEntrySize = function() {
    return this.get('entrySize');
};

/**
 * Output an IndexEntry as a buffer
 * @return {Buffer}
 */
IndexEntry.prototype.toBuffer = function(version) {
    var output = Concentrate()

        // ctime
        .uint32be(this.getCTime().getTime())
        .uint32be(0)

        // mtime
        .uint32be(this.getMTime().getTime())
        .uint32be(0)

        .uint32be(this.getDev())
        .uint32be(this.getIno())
        .uint32be(this.getUid())
        .uint32be(this.getGid())
        .uint32be(this.getEntrySize())
        .buffer((new Buffer(this.getSha())).toString('hex'))
        .uint16be(this.getFlags());


    if (version >= 3) output = output.uint16be(this.getExtendedFlags());
    output = output.string(this.getPath());

    var buf = output.result();
    var padlen = (8 - (buf.length % 8)) || 8;

    return Buffer.concat([
        buf,
        Buffer.alloc(padlen, 0)
    ]);
};

/**
 * Parse from a buffer
 * @param {Buffer}
 * @return {Object{Buffer, IndexEntry}}
 */
IndexEntry.createFromBuffer = function(buf, version) {
    var parser = Dissolve()
        .uint32be('ctime')
        .uint32be('ctime_nano')
        .uint32be('mtime')
        .uint32be('mtime_nano')
        .uint32be('dev')
        .uint32be('ino')
        .uint32be('mode')
        .uint32be('uid')
        .uint32be('gid')
        .uint32be('entrySize')
        .buffer('sha', 20)
        .uint16be('flags')
        .tap(function() {
            if (version < 3) return;

            this.uint16be('extendedFlags');
        })

        // Read path
        .tap(function() {
            this.vars.path = '';

            this.loop(function(end) {
                this.buffer('pathc', 1);
                this.tap(function() {
                    if (this.vars.pathc[0] == 0) end();
                    else {
                        this.vars.path += this.vars.pathc.toString('utf8');
                    }
                });
            });
        })
        .tap(function() {
            var offset = this.offset;
            var padlen = (8 - (offset % 8)) || 8;
            this.buffer('null', padlen);
        })
        .tap(function() {
            this.vars.ctime = new Date(this.vars.ctime);
            this.vars.mtime = new Date(this.vars.mtime);
            this.vars.sha = this.vars.sha.toString('hex');
            delete this.vars.pathc;
            delete this.vars.null;
            delete this.vars.ctime_nano;
            delete this.vars.mtime_nano;
        });

    parser.write(buf);

    return {
        buffer: buf.slice(parser.offset),
        entry: new IndexEntry(parser.vars)
    };
};

module.exports = IndexEntry;
