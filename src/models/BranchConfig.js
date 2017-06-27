/** @flow */

import { Record } from 'immutable';

/*
 * A branch in the config.
 */

const DEFAULTS: {
    remote: string,
    merge: string
} = {
    remote: '',
    merge: ''
};

class BranchConfig extends Record(DEFAULTS) {}

export default BranchConfig;
