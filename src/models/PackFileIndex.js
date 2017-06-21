/** @flow */

import { Record } from 'immutable';
import Dissolve from 'dissolve';

/*
 * Model to represent the index of a packfile.
 * It can be used to easily lookup an object in a packfile.
 * And locate objects accross multiple packfiles (see ObjectsIndex).
 *
 * https://github.com/git/git/blob/master/Documentation/technical/pack-format.txt
 */

const DEFAULTS: {
    version: string
} = {
    version: ''
};

class PackFileIndex extends Record(DEFAULTS) {}

export default PackFileIndex;
