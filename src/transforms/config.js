/** @flow */

import type { Transform } from '../models';

/*
 * Transforms to the configuration.
 */

const Transforms = {};

/*
 * Read the config.
 */
Transforms.readConfig = (transform: Transform): Promise<*> =>
    transform.repo.readConfig().then(repo => (transform.repo = repo));

/*
 * Write the config to the disk.
 */
Transforms.flushConfig = (transform: Transform): Promise<*> => {
    const { repo } = transform;
    return repo.config.writeToRepo(repo);
};

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
