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
    name:       String()
});


/*
    Parse from a buffer

    @param {Buffer}
    @return {Object{Buffer, IndexEntry}}
*/
IndexEntry.createFromBuffer = function(buf) {
    var ctimeSeconds = buf.readInt32BE(0);
    buf = buf.slice(4);

    var ctimeNanoseconds = buf.readInt32BE(0);
    buf = buf.slice(4);

    var mtimeSeconds = buf.readInt32BE(0);
    buf = buf.slice(4);

    var mtimeNanoseconds = buf.readInt32BE(0);
    buf = buf.slice(4);

    var dev = buf.readInt32BE(0);
    buf = buf.slice(4);

    var ino = buf.readInt32BE(0);
    buf = buf.slice(4);

    var mode = buf.readInt32BE(0);
    buf = buf.slice(4);

    var sha = buf.slice(0, 20).toString('hex');
    buf = buf.slice(20);

    console.log(sha);

    var entry = new IndexEntry({
        ctime: new Date(ctimeSeconds),
        mtime: new Date(mtimeSeconds),
        dev: dev,
        ino: ino,
        mode: mode,
        sha: sha
    });

    return {
        buffer: buf,
        entry: entry
    };
};

module.exports = IndexEntry;
