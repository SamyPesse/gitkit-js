/** @flow */

import { Record } from 'immutable';

const DEFAULTS: {
    name: string,
    email: string,
} = {
    name: '',
    email: '',
};

class Blob extends Record(DEFAULTS) {}

export default Blob;
