/** @flow */

import { Record, Map } from 'immutable';
import Dissolve from 'dissolve';
import { Inflate } from 'pako';
import varint from 'varint';
import uint8ToBuffer from 'typedarray-to-buffer';
import GitObject from './GitObject';

import type { SHA } from '../types/SHA';

/*
 * Model to represent the content of a packfile.
 *
 * https://github.com/git/git/blob/master/Documentation/technical/pack-format.txt
 */

const ENTRY_TYPES = {
    COMMIT: 1,
    TREE: 2,
    BLOB: 3,
    TAG: 4,
    OFS_DELTA: 6,
    REF_DELTA: 7
};

const TYPES_FOROBJECT = {
    [ENTRY_TYPES.COMMIT]: 'commit',
    [ENTRY_TYPES.TREE]: 'tree',
    [ENTRY_TYPES.BLOB]: 'blob',
    [ENTRY_TYPES.TAG]: 'tag'
};

const DEFAULTS: {
    version: string,
    objects: Map<SHA, GitObject>
} = {
    version: '',
    objects: new Map()
};

class PackFile extends Record(DEFAULTS) {
    /*
     * Read an entire pack file from a buffer.
     */
    static parseFromBuffer(buffer: Buffer): ?PackFile {
        const parser = PackFile.createStreamReader();
        let result;

        parser.on('pack', pack => {
            result = pack;
        });

        parser.write(buffer);

        return result;
    }

    /*
     * Read a packfile header from a stream of data.
     *
     * It emits an event "object" for each GitObject found.
     * It emits an event "pack" with the complete PackFile at the end.
     */
    static createStreamReader(): WritableStream {
        const parser = Dissolve({
            objectMode: true
        });

        return parsePack(parser).tap(() => {
            const pack = new PackFile({
                version: parser.vars.version,
                objects: new Map(parser.vars.objects)
            });
            parser.emit('pack', pack);
        });
    }
}

/*
 * Parse header of an object in the pack.
 * It sets the vars: size and type.
 */
function parseObjectHeader(parser: Dissolve): Dissolve {
    return parser.uint8be('byte').tap(() => {
        const byte = parser.vars.byte;
        let left = 4;

        parser.vars.type = (byte >> 4) & 7;
        parser.vars.size = byte & 0xf;

        parser
            .loop(end => {
                if (!(parser.vars.byte & 0x80)) {
                    end();
                    return;
                }

                parser.uint8be('byte').tap(() => {
                    parser.vars.size |= (parser.vars.byte & 0x7f) << left;
                    left += 7;
                });
            })
            .tap(() => {
                parser.vars.size >>>= 0;
            });
    });
}

/*
 * Parse inflate content for blob, commit and tree.
 * Also index the content for this specific index.
 *
 * It sets the vars: content.
 */
function parseInflateContent(parser: Dissolve): Dissolve {
    const inflator = new Inflate();

    // Iterate while we found end of zip content
    return parser.loop(end => {
        parser.buffer('byte', 1).tap(() => {
            const byte = parser.vars.byte;

            const ab = new Uint8Array(1);
            ab.fill(byte[0]);

            inflator.push(ab);

            if (inflator.ended) {
                if (inflator.err) {
                    parser.emit('error', new Error(inflator.msg));
                }

                parser.vars.content = uint8ToBuffer(inflator.result);

                end();
            }
        });
    });
}

/*
 * Parse a REF delta.
 */
function parseRefDelta(parser: Dissolve): Dissolve {
    return parser.string('ref', 20).then(() => {
        throw new Error('Not yet implemented');
    });
}

/*
 * Parse OFS delta's header.
 */
function parseOFSDeltaHeader(parser: Dissolve): Dissolve {
    return parser.uint8be('byte').tap(() => {
        const byte = parser.vars.byte;

        parser.vars.rv = byte & 0x7f;

        parser.loop(end => {
            if (!(parser.vars.byte & 0x80)) {
                end();
                return;
            }

            parser.uint8be('byte').tap(() => {
                parser.vars.rv += 1;
                parser.vars.rv <<= 7;
                parser.vars.rv |= parser.vars.byte & 0x7f;
            });
        });
    });
}

/*
 * Parse OFS delta, apply delta and return with vars "type" and "content".
 */
function parseOFSDelta(parser: Dissolve): Dissolve {
    return (
        parseOFSDeltaHeader(parser)
            // Extract delta content
            .tap(() => {
                parseInflateContent(parser);
            })
            // Apply delta to content
            .tap(() => {
                const { objectOffset, rv } = parser.vars;
                const offset = objectOffset - rv;

                // Get referenced type/content
                const origin = parser.packObjects[offset];

                if (origin) {
                    // Apply delta on content
                    const delta = parser.vars.content;
                    const output = applyDelta(origin.content, delta);

                    // Export as variables
                    parser.vars.content = output;
                    parser.vars.type = origin.type;
                } else {
                    throw new Error(
                        `Content for OFS_DELTA is not indexed: ${offset} - ${JSON.stringify(
                            Object.keys(parser.packObjects)
                        )} `
                    );
                }
            })
    );
}

/*
 * Parse an object entry.
 *
 * It sets the vars: object.
 */
function parseObject(parser: Dissolve): Dissolve {
    return (
        parser
            .tap(() => {
                parser.vars = {
                    objectOffset: parser.offset
                };

                parseObjectHeader(parser);
            })
            .tap(() => {
                if (parser.vars.type < 5) {
                    parseInflateContent(parser);
                } else if (parser.vars.type === ENTRY_TYPES.OFS_DELTA) {
                    parseOFSDelta(parser);
                } else if (parser.vars.type === ENTRY_TYPES.REF_DELTA) {
                    parseRefDelta(parser);
                } else {
                    parser.emit(
                        'error',
                        new Error('Invalid entry type in pack')
                    );
                }
            })
            // Index content for this offset
            // TODO: index content by sha for REF_DELTA
            .tap(() => {
                const { content, type, objectOffset } = parser.vars;

                if (!type || !content) {
                    return;
                }

                // Index the object for this offset so that it can be accessed
                // for delta.
                parser.packObjects = parser.packObjects || {};
                parser.packObjects[objectOffset] = { type, content };

                if (!TYPES_FOROBJECT[type]) {
                    throw new Error(`Unknow type: ${type}`);
                }

                const object = new GitObject({
                    type: TYPES_FOROBJECT[type],
                    content
                });

                parser.vars.object = object;
            })
    );
}

/*
 * Parse an entire packfile.
 *
 * it sets the vars "version" and "objects"
 */
function parsePack(parser: Dissolve): Dissolve {
    return parser
        .string('signature', 4)
        .uint32be('version')
        .uint32be('count')
        .tap(() => {
            const { signature, version, count } = parser.vars;

            // Check header
            if (signature !== 'PACK') {
                parser.emit('error', new Error('Invalid pack signature'));
                return;
            }

            let objectIndex = 0;
            const objects: { [string]: GitObject } = {};

            parser
                .loop(stopLoop => {
                    parseObject(parser).tap(() => {
                        const { object } = parser.vars;
                        objects[object.sha] = object;

                        parser.emit('object', object);

                        objectIndex += 1;
                        if (objectIndex == count) {
                            stopLoop();
                        }
                    });
                })
                .tap(() => {
                    parser.vars = {
                        version,
                        objects
                    };
                });
        });
}

/*
 * Apply delta from packfile to a buffer.
 * This code is mostly based on https://github.com/chrisdickinson/git-apply-delta
 */
function applyDelta(base: Buffer, deltaContent: Buffer): Buffer {
    let command;
    let idx = 0;
    let len = 0;
    let outIdx = 0;
    let delta = deltaContent;

    const OFFSET_BUFFER = new Buffer(4);
    const LENGTH_BUFFER = new Buffer(4);

    const baseSize = varint.decode(delta);
    delta = delta.slice(varint.decode.bytes);

    if (baseSize !== base.length) {
        throw new Error(
            `Base doesn't match expected size: ${baseSize} != ${base.length}`
        );
    }

    const outputSize = varint.decode(delta);
    delta = delta.slice(varint.decode.bytes);

    const output = new Buffer(outputSize);

    // Apply deltas
    len = delta.length;

    while (idx < len) {
        command = delta[idx];
        idx += 1;

        if (command & 0x80) {
            copy();
        } else {
            insert();
        }
    }

    function copy() {
        OFFSET_BUFFER.writeUInt32LE(0, 0);
        LENGTH_BUFFER.writeUInt32LE(0, 0);

        let check = 1;
        let x;

        for (x = 0; x < 4; x += 1) {
            if (command & check) {
                OFFSET_BUFFER[3 - x] = delta[idx];
                idx += 1;
            }
            check <<= 1;
        }

        for (x = 0; x < 3; x += 1) {
            if (command & check) {
                LENGTH_BUFFER[3 - x] = delta[idx];
                idx += 1;
            }
            check <<= 1;
        }
        LENGTH_BUFFER[0] = 0;

        const length = LENGTH_BUFFER.readUInt32BE(0) || 0x10000;
        const offset = OFFSET_BUFFER.readUInt32BE(0);

        base.copy(output, outIdx, offset, offset + length);
        outIdx += length;
    }

    function insert() {
        delta.copy(output, outIdx, idx, command + idx);
        idx += command;
        outIdx += command;
    }

    return output;
}

export default PackFile;
