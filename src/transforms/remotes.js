/** @flow */

import type { List } from 'immutable';
import { FetchDiscovery } from '../models';
import type { Transform, Ref } from '../models';
import type { Transport } from '../transports';

/*
 * Transforms to do remote operations.
 */

const Transforms = {};

/*
 * Clone a remote repository.
 */
Transforms.clone = (transform: Transform, transport: Transport) => {};

/*
 * Fetch from a remote transport.
 */
Transforms.fetch = (
    transform: Transform,
    transport: Transport,
    // Ref to fetch/update
    refName: string = 'HEAD'
) =>
    FetchDiscovery.fetch(transform).then(discovery => {
        const remoteRef = discovery.refs.get(refName);
        const localRef = transform.repo.refs.getRef(refName);

        if (!remoteRef) {
            throw new Error(`Couldn't find remote ref ${refName}`);
        }
    });

/*
 * Fetch a specific ref from the server.
 */
function fetchRef(
    transform: Transform,
    transport: Transport,
    wantRef: Ref,
    haveRefs: List<Ref>
) {
    const request = genRefWantRequest(wantRef, haveRefs);

    // Fetch the objects by calling git-upload-pack
    return transport.uploadPack(request);
}

/*
 * Return a buffer to send for requesting a ref.
 */
function genRefWantRequest(wantRef: Ref, haveRefs: List<Ref>): Buffer {
    const lines = [
        `want ${wantRef.commit} multi_ack_detailed side-band-64k thin-pack ofs-delta`,
        ''
    ];

    haveRefs.forEach(haveRef => {
        lines.push(`have ${haveRef.commit}\n`);
    });

    lines.push('done');

    return encodePktLines(lines);
}

export default Transforms;
