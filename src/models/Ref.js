/** @flow */

import { Record } from 'immutable';

import type { SHA } from '../types/SHA';

const DEFAULTS: {
    ref: ?string,
    commit: ?SHA
} = {
    ref: null,
    commit: null
};

class Ref extends Record(DEFAULTS) {
    /*
     * Check if this ref points to a branch name "branch".
     */
    isPointingToBranch(branch: string): boolean {
        return this.ref == `refs/heads/${branch}`;
    }

    toString(): string {
        if (this.commit) {
            return `${this.commit}\n`;
        }
        return `ref: ${this.ref}\n`;
    }

    toBuffer(): Buffer {
        return new Buffer(this.toString(), 'utf8');
    }

    /*
     * Write the ref as a file.
     */
    writeToRepo(repo: Repository, filename: string): Promise<*> {
        const { fs } = repo;
        const content = this.toBuffer();
        const filepath = repo.resolveGitFile(filename);

        return fs.write(filepath, content);
    }

    /*
     * Create a Ref instance from the content of a ref file.
     */
    static createFromBuffer(buffer: Buffer): Ref {
        return this.createFromString(buffer.toString('utf8'));
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
