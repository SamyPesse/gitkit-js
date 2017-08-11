/** @flow */

import { Record } from 'immutable';

/*
 * An index for an object found while parsing a PackFileIndex.
 */

const DEFAULTS: {
    offset: number,
    crc: string
} = {
    offset: 0,
    crc: ''
};

class PackIndexOffset extends Record(DEFAULTS) {}

export default PackIndexOffset;
