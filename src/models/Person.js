/** @flow */

import { Record } from 'immutable';

const DEFAULTS: {
    name: string,
    email: string,
} = {
    name: '',
    email: '',
};

class Person extends Record(DEFAULTS) {}

export default Person;
