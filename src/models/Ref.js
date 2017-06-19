/** @flow */

import { Record } from 'immutable';

import type { SHA } from '../types/SHA';

const DEFAULTS: {
    ref: ?string,
    commit: ?SHA,
} = {
    ref: null,
    commit: null
};

class Ref extends Record(DEFAULTS) {

    /*
     * A detached head is when the HEAD is pointing to a commit
     * instead of a ref.
     *
     * https://git-scm.com/docs/git-checkout#_detached_head
     */
    get isDetached(): boolean {
        return !!this.commit;
    }

    toString(): string {
        if (this.isDetached) {
            return `${this.commit}\n`;
        } else {
            return `ref: ${this.ref}\n`;
        }
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
        content = content.trim()

        // Are we matching a ref ?
        const match = content.match(/ref:\s+(\S+)/);
        if (match) {
            return new Ref({
                ref: match[1]
            });
        }

        return new Ref({
            commit: content
        });
    }
}

export default Ref;
