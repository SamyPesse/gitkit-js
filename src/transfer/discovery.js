/* @flow */
/* eslint-disable array-callback-return */

import es from 'event-stream';
import combine from 'stream-combiner2';

import Ref from '../models/Ref';

import {
    LINEMETA_TYPES,
    createPackLineParser,
    createPackLineMetaParser
} from './lines';

/*
 * Parse an upload result into a list of packs.
 * It emits "data" for each ref.
 */
function createDiscoveryParser({
    onCapabilities = () => {}
}: {
    onCapabilities: (caps: string[]) => *
}): WritableStream {
    let lineIndex = 0;

    return combine.obj(
        // Parse as lines
        createPackLineParser(),
        // Parse metatdata of lines
        createPackLineMetaParser(),
        // Read infos from lines.
        es.map((line, callback) => {
            lineIndex += 1;

            if (line.caps) {
                onCapabilities(line.caps);
            }

            if (lineIndex === 1 || line.type !== LINEMETA_TYPES.LINE) {
                callback();
                return;
            }

            const content = line.toString('utf8').trim();
            const parts = content.split(' ');

            const refName = parts[1];
            const sha = parts[0];
            const ref = new Ref({ commit: sha });

            callback(null, {
                name: refName,
                ref
            });
        })
    );
}

export { createDiscoveryParser };
