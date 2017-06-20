/** @flow */

import { Readable } from 'stream';
import { Record, List } from 'immutable';
import Dissolve from 'dissolve';
import PackFileEntry from './PackFileEntry';

/*
 * Model to represent the header of a packfile.
 * Pack file headers can be used to read a specific object.
 *
 * https://github.com/git/git/blob/master/Documentation/technical/pack-format.txt
 */

const DEFAULTS: {
    version: string,
    objects: List<PackFileEntry>
} = {
    version: '',
    objects: new List()
};

class PackFile extends Record(DEFAULTS) {

    /*
     * Read a packfile header from a stream of data.
     *
     * It emits an event "data" for each PackFileEntry found.
     * It emits an event "pack" with the complete PackFile at the end.
     */
    static createStreamReader(
        stream: Stream
    ) {
        return Dissolve({
            objectMode: true
        })
        .string('signature', 4)
        .uint32be('version')
        .uint32be('count')
        .tap(function() {
            const { signature, version, count } = this.vars;


            // Check header
            if (signature !== 'PACK') {
                this.emit('error', new Error('Invalid pack signature'));
                return;
            }

            const objectIndex = 0;

            /*
            .loop((stopLoop) => {

                this.tap(() => {
                    if (objectIndex == count) {
                        stopLoop();
                    }
                });
            })
             */

            this
            .tap(() => {
                const pack = new PackFile({
                    version
                });

                this.emit('pack', pack);
            });
        });
    }

    /*
     * Read an entire pack file from a buffer.
     */
    static parseFromBuffer(buffer: Buffer): ?PackFile {
        const parser = PackFile.createStreamReader();
        let result;

        parser.on('pack', (pack) => {
            result = pack;
        });

        parser.write(buffer);

        return result;
    }
}

export default PackFile;
