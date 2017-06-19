/** @flow */

import { Record } from 'immutable';

const DEFAULTS: {
    name: string,
    ref: string,
} = {
    name: '',
    ref: '',
};

class Branch extends Record(DEFAULTS) {}

export default Branch;
