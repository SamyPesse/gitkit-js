/** @flow */

import { Record } from 'immutable';

/*
 * An index for an object found while parsing a PackFileIndex.
 */

const DEFAULTS: {
    offset: number,
    oid: string,
    crc: string
} = {
    offset: 0,
    oid: '',
    crc: ''
};

class PackIndexOffset extends Record(DEFAULTS) {}

export default PackIndexOffset;
