var Immutable = require('immutable');
var IndexEntry = require('./indexEntry');

var WorkingIndex = Immutable.Record({
    version: Number(),
    entries: Immutable.List()
});

WorkingIndex.prototype.getEntries = function() {
    return this.get('entries');
};

WorkingIndex.prototype.getVersion = function() {
    return this.get('version');
};

/*
    Parse a working inex from a Buffer

    @param {Buffer} content
    @return {WorkingIndex}
*/
WorkingIndex.createFromBuffer = function(content) {
    var version, nEntries;
    var entriesBuf;
    var entries = Immutable.List();

    var header = content.slice(0, 12);

    // Validate header signature
    var signature = header.slice(0, 4);
    if (signature.toString() !== 'DIRC') {
        throw new Error('Invalid working index header');
    }

    // Read the version
    version = header.readInt32BE(4);

    // Read the number of entries
    nEntries = header.readInt32BE(8);

    entriesBuf = content.slice(12);
    for (var i = 0; i < nEntries; i++) {
        var result = IndexEntry.createFromBuffer(entriesBuf, version);
        entriesBuf = result.buffer;
        entries = entries.push(result.entry);
    }

    return new WorkingIndex({
        version: version,
        entries: entries
    });
};

/*
    Read a WorkingIndex from a repository using its filename

    @param {Repository} repo
    @paran {String} refPath
    @return {Promise<WorkingIndex>}
*/
WorkingIndex.readFromRepo = function(repo, fileName) {
    fileName = fileName || 'index';

    return repo.readGitFile(fileName)
        .then(WorkingIndex.createFromBuffer);
};


module.exports = WorkingIndex;
