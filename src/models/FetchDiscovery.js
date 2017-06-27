/** @flow */

import { Record, OrderedMap, List } from 'immutable';
import Ref from './Ref';

import type { Transport } from '../transports';

/*
 * Model to represent the discovery between the server
 * and the client during a fetch/clone.
 *
 * Parses the response to /info/refs?service=git-upload-pack, which contains ids for
 * refs/heads and a capability listing for this git HTTP server.
 */

const DEFAULTS: {
    refs: OrderedMap<string, Ref>,
    capabilities: List<string>
} = {
    refs: new OrderedMap(),
    capabilities: List()
};

class FetchDiscovery extends Record(DEFAULTS) {
    /*
     * Fetch discovery from the server using a transport.
     */
    static fetch(transport: Transport): Promise<FetchDiscovery> {
        return transport.getWithUploadPack('info/refs').then(
            res =>
                new Promise((resolve, reject) => {
                    let capabilities;
                    let lineIndex = 0;
                    let refs = new OrderedMap();

                    res
                        .pipe(createPKTLinesParser())
                        .pipe(createPKTLinesMetaParser())
                        .on('data', line => {
                            lineIndex += 1;

                            if (line.caps && !capabilities) {
                                capabilities = line.caps;
                            }

                            if (
                                lineIndex === 1 ||
                                line.type !== LINEMETA_TYPES.LINE
                            ) {
                                return;
                            }

                            const content = line.toString('utf8').trim();
                            const parts = content.split(' ');

                            const refName = parts[1];
                            const sha = parts[0];
                            const ref = new Ref({ commit: sha });

                            refs = refs.set(refName, ref);
                        })
                        .on('error', err => {
                            reject(err);
                        })
                        .on('end', () => {
                            resolve(
                                new FetchDiscovery({
                                    refs,
                                    capabilities: List(capabilities)
                                })
                            );
                        });
                })
        );
    }
}

export default FetchDiscovery;
