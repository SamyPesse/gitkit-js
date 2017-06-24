/** @flow */

import { Record } from 'immutable';
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

const DEFAULTS: {
    version: string
} = {
    version: ''
};

class PackFileIndex extends Record(DEFAULTS) {
    /*
     * Check if an object is in this packfile.
     */
    hasObject(sha: SHA): boolean {
        return false;
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
            const index = new PackFileIndex({
                version: parser.vars.version
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
    return parser;
}

export default PackFileIndex;
