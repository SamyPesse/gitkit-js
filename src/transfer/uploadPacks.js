/* @flow */
import throughFilter from 'through2-filter';
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
        throughFilter.obj(line => line.type == LINEMETA_TYPES.PACKFILE),
        // Parse pack as objects
        parsePack(opts),
        // Not sure why... But without this filter, .on('data') doesn't work
        throughFilter.obj(() => true)
    );
}

export { createUploadPackParser };
