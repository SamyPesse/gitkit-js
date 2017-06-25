/** @flow */

import { Record, OrderedMap } from 'immutable';
import Dissolve from 'dissolve';

import PackIndexOffset from './PackIndexOffset';
import type { SHA } from '../types/SHA';

/*
 * Model to represent the index of a packfile.
 * It can be used to easily lookup an object in a packfile.
 * And locate objects accross multiple packfiles (see ObjectsIndex).
 *
 * https://github.com/git/git/blob/master/Documentation/technical/pack-format.txt
 */

const V2_MAGIC = 0xff744f63;

const DEFAULTS: {
    version: number,
    objects: OrderedMap<SHA, PackIndexOffset>
} = {
    version: 2,
    objects: new OrderedMap()
};

class PackFileIndex extends Record(DEFAULTS) {
    /*
     * Check if an object is in this packfile.
     */
    hasObject(sha: SHA): boolean {
        const { objects } = this;
        return objects.has(sha);
    }

    /*
     * Read an entire pack file index from a buffer.
     */
    static createFromBuffer(buffer: Buffer): ?PackFileIndex {
        const parser = PackFileIndex.createStreamReader();
        let result;

        parser.on('index', index => {
            result = index;
        });

        parser.write(buffer);

        return result;
    }

    /*
     * Read a packfile index from a stream of data.
     *
     * It emits an event "object" for each GitObject found.
     * It emits an event "pack" with the complete PackFile at the end.
     */
    static createStreamReader(): WritableStream {
        const parser = Dissolve({
            objectMode: true
        });

        return parsePackIndex(parser).tap(() => {
            const { shas, crcs, offsets, version } = parser.vars;

            const index = new PackFileIndex({
                version,
                objects: new OrderedMap(
                    shas.map((sha, i) => [
                        sha,
                        new PackIndexOffset({
                            crc: crcs[i],
                            offset: offsets[i]
                        })
                    ])
                )
            });
            parser.emit('index', index);
        });
    }
}

/*
 * Parse an entire packfile index.
 *
 * it sets the vars "version" and "objects"
 */
function parsePackIndex(parser: Dissolve): Dissolve {
    return parser.uint32be('magic').tap(() => {
        if (parser.vars.magic !== V2_MAGIC) {
            parser.emit('error', new Error("Can't parse version 1 packfile"));
            return;
        }

        parser.uint32be('version');
        parseFanoutTable(parser);
        parseObjectSHAs(parser);
        parseObjectCRC32(parser);
        parseObjectOffsets(parser);
    });
}

/*
 * Parse the fanout table.
 */
function parseFanoutTable(parser: Dissolve): Dissolve {
    return parser.buffer('fanout', 1020).uint32be('expected');
}

/*
 * Parse the object shas.
 * It create a variable "shas": Array<SHA>.
 */
function parseObjectSHAs(parser: Dissolve): Dissolve {
    return parser.tap(() => {
        const { expected } = parser.vars;
        let i = 0;

        parser.vars.shas = [];

        parser.loop(end => {
            if (i == expected) {
                end();
                return;
            }

            parser.buffer('sha', 20).tap(() => {
                const sha = parser.vars.sha.toString('hex');
                parser.vars.shas.push(sha);

                i += 1;
            });
        });
    });
}

/*
 * Parse the object CRC32s.
 * It create a variable "crcs": Array<Number>.
 */
function parseObjectCRC32(parser: Dissolve): Dissolve {
    return parser.tap(() => {
        const { expected } = parser.vars;
        let i = 0;

        parser.vars.crcs = [];

        parser.loop(end => {
            if (i == expected) {
                end();
                return;
            }

            parser.int32('crc').tap(() => {
                const { crc } = parser.vars;
                parser.vars.crcs.push(crc);

                i += 1;
            });
        });
    });
}

/*
 * Parse the object offsets.
 * It create a variable "offsets": Array<Number>.
 *
 * TODO: support large offset.
 */
function parseObjectOffsets(parser: Dissolve): Dissolve {
    return parser.tap(() => {
        const { expected } = parser.vars;
        let i = 0;

        parser.vars.offsets = [];

        parser.loop(end => {
            if (i == expected) {
                end();
                return;
            }

            parser.uint32be('offset').tap(() => {
                const { offset } = parser.vars;
                parser.vars.offsets.push(offset);

                i += 1;
            });
        });
    });
}

export default PackFileIndex;
