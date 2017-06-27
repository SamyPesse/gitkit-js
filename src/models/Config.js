/** @flow */

import ini from 'ini';
import { Record, Map, OrderedMap } from 'immutable';
import RemoteConfig from './RemoteConfig';
import BranchConfig from './BranchConfig';

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
}

export default Config;
