/** @flow */

import Ref from './Ref';
import type Repository from './Repository';

class Head extends Ref {
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
     * Read the HEAD from the repository.
     * The HEAD reference is not stored in the packed-refs
     */
    static readFromRepository(repo: Repository): Promise<Ref> {
        const { fs } = repo;
        const indexpath = repo.resolveGitFile('HEAD');

        return fs.read(indexpath).then(buffer => Head.createFromBuffer(buffer));
    }
}

export default Head;
