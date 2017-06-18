/** @flow */

import path from 'path';
import { Record } from 'immutable';
import GenericFS from '../fs/GenericFS';

const DEFAULTS: {
    isBare: boolean,
    fs: GenericFS,
} = {
    isBare: false,
    fs: new GenericFS(),
};

class Repository extends Record(DEFAULTS) {

    /*
     * Resolve a file from the .git folder.
     */
    resolveGitFile(file: string): string {
        const { isBare } = this;
        return isBare ? file : path.join('.git', file);
    }
}

export default Repository;
