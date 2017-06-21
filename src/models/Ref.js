/** @flow */

import { Record } from 'immutable';

import type { SHA } from '../types/SHA';
import type Repository from './Repository';

const DEFAULTS: {
    ref: ?string,
    commit: ?SHA
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

    /*
     * Check if this ref points to a branch name "branch".
     */
    pointToBranch(branch: string): boolean {
        return this.ref == `refs/heads/${branch}`;
    }

    toString(): string {
        if (this.isDetached) {
            return `${this.commit}\n`;
        }
        return `ref: ${this.ref}\n`;
    }

    toBuffer(): Buffer {
        return new Buffer(this.toString(), 'utf8');
    }

    /*
     * Read the HEAD from the repository.
     * The HEAD reference is not stored in the packed-refs
     */
    static readHEADFromRepository(repo: Repository): Promise<Ref> {
        const { fs } = repo;
        const indexpath = repo.resolveGitFile('HEAD');

        return fs.read(indexpath).then(buffer => Ref.createFromBuffer(buffer));
    }

    /*
     * Create a Ref instance from the content of a ref file.
     */
    static createFromBuffer(buffer: Buffer): Ref {
        return Ref.createFromString(buffer.toString('utf8'));
    }

    static createFromString(content: string): Ref {
        const trimmed = content.trim();

        // Are we matching a ref ?
        const match = trimmed.match(/ref:\s+(\S+)/);
        if (match) {
            return new Ref({
                ref: match[1]
            });
        }

        return new Ref({
            commit: trimmed
        });
    }
}

export default Ref;
