/** @flow */

import type GitKit from '../GitKit';

/*
 * Transforms to the configuration.
 */

const Transforms = {};

/*
 * Read the config.
 */
Transforms.readConfig = (gitkit: GitKit): Promise<*> =>
    gitkit.repo.readConfig().then(repo => (gitkit.repo = repo));

/*
 * Write the config to the disk.
 */
Transforms.flushConfig = (gitkit: GitKit): Promise<*> => {
    const { repo } = gitkit;
    return repo.config.writeToRepo(repo);
};

/*
 * Add a new remote.
 */
Transforms.addRemote = (gitkit: GitKit, name: string, url: string): GitKit => {
    const { repo } = gitkit;
    const { config } = repo;

    gitkit.repo = repo.merge({
        config: config.addRemote(name, url)
    });

    return gitkit;
};

export default Transforms;
