/* @flow */

import es from 'event-stream';
import combine from 'stream-combiner2';

import {
    LINEMETA_TYPES,
    createPackLineParser,
    createPackLineMetaParser
} from './lines';

/*
 * Parse an upload result into a list of packs
 */
function createUploadPackParser(opts): WritableStream {
    return combine.obj(
        // Parse as lines
        createPackLineParser(),
        // Parse metatdata of lines
        createPackLineMetaParser(),
        // Filter packs
        es.map((line, callback) => {
            if (line.type == LINEMETA_TYPES.PACKFILE) {
                callback(null, line);
            } else {
                callback();
            }
        }),
        // Parse pack as objects
        parsePack(opts)
    );
}

export { createUploadPackParser };
