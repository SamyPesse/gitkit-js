/** @flow */

import type { Transform } from '../models';

/*
 * Transforms to edit the working index.
 */

const Transforms = {};

Transforms.addFile = (transform: Transform, filename: string) => {
    const { fs } = transform.repo;

    return fs.stat(filename).then(stat => {});
};

export default Transforms;
