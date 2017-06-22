/** @flow */

import type { Transform } from '../models';

/*
 * Transforms to edit files.
 */

const Transforms = {};

Transforms.writeFile = (
    transform: Transform,
    filename: string,
    content: Buffer | string
) => {};

Transforms.mkdir = (transform: Transform, dirname: string) => {};

Transforms.unlinkFile = (transform: Transform, filename: string) => {};

export default Transforms;
