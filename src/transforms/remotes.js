/** @flow */

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

export default Transforms;
