/** @flow */

import { Record } from 'immutable';

/*
 * A remote in the config.
 */

const DEFAULTS: {
    url: string,
    fetch: string
} = {
    url: '',
    fetch: ''
};

class RemoteConfig extends Record(DEFAULTS) {}

export default RemoteConfig;
