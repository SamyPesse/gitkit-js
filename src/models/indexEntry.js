// @flow

var Immutable = require('immutable');
var Concentrate = require('concentrate');
var Dissolve = require('dissolve');

var defaultRecord: {
    ctime:         Date,
    mtime:         Date,
    dev:           number,
    mode:          number,
    uid:           number,
    gid:           number,
    entrySize:     number,
    flags:         number,
    extendedFlags: number,
    sha:           string,
    path:          string
} = {
    ctime:         new Date(),
    mtime:         new Date(),
    dev:           Number(),
    ino:           Number(),
    mode:          Number(),
    uid:           Number(),
    gid:           Number(),
    entrySize:     Number(),
    flags:         Number(),
    extendedFlags: Number(),
    sha:           String(),
    path:          String()
};

class IndexEntry extends Immutable.Record(defaultRecord) {
    getDev() : number {
        return this.get('dev');
    };

    getIno() : number {
        return this.get('ino');
    };

    getUid() : number {
        return this.get('uid');
    };

    getGid() : number {
        return this.get('gid');
    };

    getCTime() : Date {
        return this.get('ctime');
    };

    getMTime() : Date {
        return this.get('mtime');
    };

    getMode() : number {
        return this.get('mode');
    };

    getPath() : string {
        return this.get('path');
    };

    getSha() : string {
        return this.get('sha');
    };

    getFlags() : number {
        return this.get('flags');
    };

    getExtendedFlags() : number {
        return this.get('extendedFlags');
    };

    getEntrySize() : number {
        return this.get('entrySize');
    };

    /**
     * Output an IndexEntry as a buffer
     * @return {Buffer}
     */
    toBuffer(version: number) : Buffer {
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


        if (version >= 3) {
            output = output.uint16be(this.getExtendedFlags());
        }
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
    static createFromBuffer(buf: Buffer, version: number) {
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
}

module.exports = IndexEntry;
