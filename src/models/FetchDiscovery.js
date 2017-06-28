/** @flow */

import { Record, OrderedMap, List } from 'immutable';
import Ref from './Ref';

import type { Transport } from '../transports';
import { createDiscoveryParser } from '../transfer';

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
                    let refs = new OrderedMap();

                    res
                        .pipe(
                            createDiscoveryParser({
                                onCapabilities: caps => {
                                    capabilities = capabilities || caps;
                                }
                            })
                        )
                        .on(
                            'data',
                            ({ name, ref }: { name: string, ref: Ref }) => {
                                refs = refs.set(name, ref);
                            }
                        )
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
