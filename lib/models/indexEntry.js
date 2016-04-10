var Immutable = require('immutable');

var IndexEntry = Immutable.Record({
    ctime:      Date(),
    mtime:      Date(),
    dev:        Number(),
    ino:        Number(),
    mode:       Number(),
    uid:        Number(),
    gid:        Number(),
    entrySize:  Number(),
    sha:        String(),
    path:       String()
});

IndexEntry.prototype.getMode = function() {
    return this.get('mode');
};

IndexEntry.prototype.getPath = function() {
    return this.get('path');
};

IndexEntry.prototype.getSha = function() {
    return this.get('sha');
};

IndexEntry.prototype.getEntrySize = function() {
    return this.get('entrySize');
};

/*
    Parse from a buffer

    @param {Buffer}
    @return {Object{Buffer, IndexEntry}}
*/
IndexEntry.createFromBuffer = function(buf, version) {
    var offset = 0;

    function read(n) {
        var result = buf.slice(0, n);
        offset += n;

        buf = buf.slice(n);

        return result;
    }


    var ctimeSeconds = read(4).readInt32BE(0);
    var ctimeNanoseconds = read(4).readInt32BE(0);

    var mtimeSeconds = read(4).readInt32BE(0);
    var mtimeNanoseconds = read(4).readInt32BE(0);

    var dev = read(4).readInt32BE(0);
    var ino = read(4).readInt32BE(0);
    var mode = read(4).readInt32BE(0);
    var uid = read(4).readInt32BE(0);
    var gid = read(4).readInt32BE(0);
    var entrySize = read(4).readInt32BE(0);
    var sha = read(20).toString('hex');
    var flags = read(2).readUInt16BE(0);

    if (version >= 3) {
        read(2);
    }

    var endName = buf.indexOf(0);
    var name = read(endName).toString('utf8');

    var padlen = (8 - (offset % 8)) || 8;
    var nullBytes = read(padlen);

    var entry = new IndexEntry({
        ctime: new Date(ctimeSeconds),
        mtime: new Date(mtimeSeconds),
        dev: dev,
        ino: ino,
        mode: mode,
        uid: uid,
        gid: gid,
        sha: sha,
        entrySize: entrySize,
        path: name
    });

    return {
        buffer: buf,
        entry: entry
    };
};

module.exports = IndexEntry;
