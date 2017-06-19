/** @flow */

import path from 'path';
import { Record } from 'immutable';

import type { SHA } from '../types/SHA';

const DEFAULTS: {
    commit: SHA,
} = {
    commit: '',
};

class Ref extends Record(DEFAULTS) {

    toString(): string {
        return `${this.commit}\n`;
    }

    toBuffer(): Buffer {
        return new Buffer(this.toString(), 'utf8');
    }

    /*
     * Create a Ref instance from the content of a ref file.
     */
    static createFromBuffer(buffer: Buffer): Ref {
        return Ref.createFromString(buffer.toString('utf8'));
    }

    static createFromString(content: string): Ref {
        return new Ref({
            commit: content.trim()
        });
    }

    /*
     * Get path in a git repository for a ref.
     */
    static getPath(name: string): string {
        return path.join('refs', name);
    }
}

export default Ref;
