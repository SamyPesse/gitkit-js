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

class Head extends Record(DEFAULTS) {

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
     * Create a Head instance from the content of a HEAD file.
     */
    static createFromBuffer(buffer: Buffer): Head {
        return Head.createFromString(buffer.toString('utf8'));
    }

    static createFromString(content: string): Head {
        content = content.trim()

        // Are we matching a ref ?
        const match = content.match(/ref:\s+(\S+)/);
        if (match) {
            return new Head({
                ref: match[1]
            });
        }

        return new Head({
            commit: content
        });
    }
}

export default Head;
