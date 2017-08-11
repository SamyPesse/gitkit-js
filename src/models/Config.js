/** @flow */

import ini from 'ini';
import { Record, Map, OrderedMap } from 'immutable';
import RemoteConfig from './RemoteConfig';
import BranchConfig from './BranchConfig';
import type Repository from './Repository';

/*
 * Model to represent the parsing of the .git/config file.
 */

const DEFAULTS: {
    core: Map<string, string | boolean | number>,
    remotes: OrderedMap<string, RemoteConfig>,
    branches: OrderedMap<string, BranchConfig>
} = {
    core: new Map(),
    remotes: new OrderedMap(),
    branches: new OrderedMap()
};

class Config extends Record(DEFAULTS) {
    /*
     * Return a string version of the config.
     */
    toString() {
        const { core, remotes, branches } = this;

        const raw = {
            core: core.toJS()
        };

        remotes.forEach((remote, name) => {
            raw[`remote "${name}"`] = remote.toJS();
        });

        branches.forEach((branch, name) => {
            raw[`branch "${name}"`] = branch.toJS();
        });

        return ini.stringify(raw);
    }

    /*
     * Write the config to the disk.
     */
    writeToRepo(repo: Repository): Promise<*> {
        const { fs } = repo;
        const configPath = repo.resolveGitFile('config');

        return fs.write(configPath, new Buffer(this.toString(), 'utf8'));
    }

    /*
     * Add a new remote.
     */
    addRemote(name: string, url: string): Config {
        const { remotes } = this;
        const remote = new RemoteConfig({
            url,
            fetch: `+refs/heads/*:refs/remotes/${name}/*`
        });

        return this.merge({
            remotes: remotes.set(name, remote)
        });
    }

    /*
     * Parse the git config from a string.
     */
    static createFromString(content: string): Config {
        const raw = ini.parse(content);
        let branches = new OrderedMap();
        let remotes = new OrderedMap();

        Object.keys(raw).forEach(key => {
            const match = /(\S+) "(.*)"/.exec(key);
            if (!match) {
                return;
            }

            const prop = match[1];
            const name = match[2];
            const value = raw[key];

            if (prop == 'branch') {
                branches = branches.set(name, new BranchConfig(value));
            } else if (prop == 'remote') {
                remotes = remotes.set(name, new RemoteConfig(value));
            }
        });

        return new Config({
            core: new Map(raw.core || {}),
            branches,
            remotes
        });
    }

    /*
     * Read the config from the repository.
     */
    static readFromRepository(repo: Repository): Promise<Config> {
        const { fs } = repo;
        const configPath = repo.resolveGitFile('config');

        return fs
            .read(configPath)
            .then(buffer => Config.createFromString(buffer.toString('utf8')));
    }
}

export default Config;
