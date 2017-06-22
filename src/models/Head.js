/** @flow */

import Ref from './Ref';
import type Repository from './Repository';

class Head extends Ref {
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
