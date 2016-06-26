var Immutable = require('immutable');
var Concentrate = require('concentrate');

var IndexEntry = require('./indexEntry');
import type Repository from './repo';
type IndexEntries = OrderedMap<string, IndexEntry>;

const SIGNATURE = 'DIRC';

const defaultRecord: {
    version: number,
    entries: IndexEntries
} = {
    version: 0,
    entries: Immutable.OrderedMap()
};

class WorkingIndex extends Immutable.Record(defaultRecord) {
    getEntries() : IndexEntries {
        return this.get('entries');
    }

    getVersion() : number {
        return this.get('version');
    }

    /**
     * Output as a buffer
     * @return {Buffer}
     */
    toBuffer() : Buffer {
        var entries = this.getEntries();
        var version = this.getVersion();

        var output = Concentrate()
            .string(SIGNATURE)
            .uint32be(version)
            .uint32be(entries.size);

        entries.each(function(entry) {
            output.buffer(entry.toBuffer(version));
        });

        return output.result;
    }

    /**
     * Parse a working inex from a Buffer
     *
     * @param {Buffer} content
     * @return {WorkingIndex}
     */
    static createFromBuffer(content: Buffer) : WorkingIndex {
        var version, nEntries;
        var entriesBuf;
        var entries = Immutable.OrderedMap();

        var header = content.slice(0, 12);

        // Validate header signature
        var signature = header.slice(0, 4);
        if (signature.toString() !== SIGNATURE) {
            throw new Error('Invalid working index header');
        }

        // Read the version
        version = header.readInt32BE(4);

        // Read the number of entries
        nEntries = header.readInt32BE(8);

        entriesBuf = content.slice(12);
        for (var i = 0; i < (nEntries - 1); i++) {
            var result = IndexEntry.createFromBuffer(entriesBuf, version);
            entriesBuf = result.buffer;
            entries = entries.set(
                result.entry.getPath(),
                result.entry
            );
        }

        return new WorkingIndex({
            version: version,
            entries: entries
        });
    };

    /**
     * Read a WorkingIndex from a repository using its filename
     *
     * @param {Repository} repo
     * @paran {String} refPath
     * @return {Promise<WorkingIndex>}
     */
    readFromRepo(repo: Repository, fileName: string) : Promise<WorkingIndex> {
        fileName = fileName || 'index';

        return repo.readGitFile(fileName)
            .then(WorkingIndex.createFromBuffer);
    }

    /**
     * Write a working index in a repository.
     *
     * @param {Repository} repo
     * @param {WorkingIndex} obj
     * @return {Promise}
     */
    writeToRepo(repo: Repository, workingIndex: WorkingIndex, fileName: string) : Promise {
        fileName = fileName || 'index';

        return repo.writeGitFile(fileName, workingIndex.toBuffer());
    }
}

module.exports = WorkingIndex;
