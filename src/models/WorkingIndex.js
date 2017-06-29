/** @flow */

import Debug from 'debug';
import { Record, OrderedMap } from 'immutable';
import Dissolve from 'dissolve';
import Concentrate from 'concentrate';
import IndexEntry from './IndexEntry';
import sha1 from '../utils/sha1';
import type Repository from './Repository';

/*
 * Model to represent the index of the git repository
 *
 * https://github.com/git/git/blob/master/Documentation/technical/index-format.txt
 */

const SIGNATURE = 'DIRC';
const debug = Debug('gitkit:workingIndex');

const DEFAULTS: {
    version: number,
    entries: OrderedMap<string, IndexEntry>
} = {
    version: 2,
    entries: new OrderedMap()
};

class WorkingIndex extends Record(DEFAULTS) {
    /*
     * Add or update an entry.
     */
    addEntry(entry: IndexEntry): WorkingIndex {
        const { entries } = this;

        return this.merge({
            entries: entries.set(entry.path, entry)
        });
    }

    /*
     * Convert this index to a buffer that can be written.
     */
    toBuffer(): Buffer {
        const { version, entries } = this;

        const output = Concentrate()
            .string(SIGNATURE)
            .uint32be(version)
            .uint32be(entries.size);

        entries.forEach(entry => {
            output.buffer(entry.toBuffer(version));
        });

        const inner = output.result();
        const innerSHA = sha1.encode(inner);

        return Buffer.concat([inner, new Buffer(innerSHA, 'hex')]);
    }

    /*
     * Write the index file in the repository.
     */
    writeToRepo(repo: Repository): Promise<*> {
        const { fs } = repo;
        const content = this.toBuffer();
        const filepath = repo.resolveGitFile('index');

        debug('write the index file');
        return fs.write(filepath, content);
    }

    /*
     * Read from the repositpry.
     */
    static readFromRepository(repo: Repository): Promise<WorkingIndex> {
        const { fs } = repo;
        const indexpath = repo.resolveGitFile('index');

        debug(`read index file from ${indexpath}`);
        return fs.read(indexpath).then(
            buffer => WorkingIndex.createFromBuffer(buffer),
            // The index file may not exist
            error => {
                debug('no index file found in the repository');
                return Promise.resolve(new WorkingIndex());
            }
        );
    }

    /*
     * Create a working index from a buffer.
     */
    static createFromBuffer(buffer: Buffer): WorkingIndex {
        const parser = WorkingIndex.createParser();
        let result = new WorkingIndex();

        parser.on('index', (index: WorkingIndex) => {
            result = index;
        });

        parser.write(buffer);

        return result;
    }

    /*
     * Create a parser for a working index.
     *
     * It emits events:
     *      - "entry" for each file entry
     *      - "index" for the entire WorkingIndex
     */
    static createParser(): WritableStream {
        const parser = Dissolve();

        parser
            .buffer('signature', 4)
            .int32be('version')
            .int32be('count')
            .tap(() => {
                const { signature, count, version } = parser.vars;
                let entries = new OrderedMap();

                if (signature.toString() != SIGNATURE) {
                    this.emit(new Error('Invalid signature for index file'));
                    return;
                }

                let i = 0;

                parser
                    .loop(end => {
                        IndexEntry.createParser(version, parser).tap(() => {
                            const { entry } = parser.vars;
                            entries = entries.set(entry.path, entry);

                            i += 1;
                            if (i === count) {
                                end();
                            }
                        });
                    })
                    .tap(() => {
                        parser.emit(
                            'index',
                            new WorkingIndex({
                                version,
                                entries
                            })
                        );
                    });
            });

        return parser;
    }
}

export default WorkingIndex;
