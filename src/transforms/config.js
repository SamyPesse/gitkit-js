/** @flow */

import type { Transform } from '../models';

/*
 * Transforms to the configuration.
 */

const Transforms = {};

/*
 * Add a new remote.
 */
Transforms.addRemote = (transform: Transform, name: string, url: string) => {
    const { repo } = transform;
    const { config } = repo;

    transform.repo = repo.merge({
        config: config.addRemote(name, url)
    });
};

export default Transforms;
