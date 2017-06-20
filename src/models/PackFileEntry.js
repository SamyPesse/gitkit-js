/** @flow */

import { Record } from 'immutable';

/*
 * Model to represent an entry for an object in the header.
 */

const DEFAULTS: {
    type: string,
    name: string,
    offset: number,
    length: number
} = {
    type: '',
    name: '',
    offset: 0,
    length: 0
};

class PackFileEntry extends Record(DEFAULTS) {

    /*
     * Parse
     */

}

export default PackFileEntry;
