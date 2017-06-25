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
) => {
    const { fs } = transform.repo;
    return fs.writeFile(filename, content);
};

Transforms.mkdir = (transform: Transform, dirname: string) => {
    const { fs } = transform.repo;
    return fs.mkdir(dirname);
};

Transforms.unlinkFile = (transform: Transform, filename: string) => {
    const { fs } = transform.repo;
    return fs.unlinkFile(filename);
};

export default Transforms;
