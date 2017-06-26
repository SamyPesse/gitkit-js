/** @flow */

import { FetchDiscovery } from '../models';
import type { Transform } from '../models';
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
Transforms.fetch = (transform: Transform, transport: Transport) =>
    FetchDiscovery.fetch(transform).then(discovery => ({}));

export default Transforms;
