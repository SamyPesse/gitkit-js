/** @flow */

import { Record, OrderedMap } from 'immutable';
import Ref from './Ref';

import type Repository from './Repository';

const PACKED_FILE = 'packed-refs';

// Prefix for local branches.
const BRANCH_PREFIX = 'refs/heads/';

/*
 * A listing of refs that can be created from:
 *  1. Read the .git/refs folder
 *  2. Read the .git/packed-refs
 */

const DEFAULTS: {
    refs: OrderedMap<string,Ref>,
} = {
    refs: OrderedMap(),
};

class RefsIndex extends Record(DEFAULTS) {

    /*
     * Filter refs to only return local branches.
     */
    get branches(): OrderedMap<string,Ref> {
        const { refs } = this;

        return refs
        .filter((ref, refName) => refName.indexOf(BRANCH_PREFIX) === 0)
        .mapKeys(refName => refName.slice(BRANCH_PREFIX.length));
    }

    /*
     * Read the index of refs from the repository.
     * It list both refs in the .git/refs directory, and decode the refs in
     * the .git/packed-refs
     */
    static readFromRepository(
        repo: Repository
    ): Promise<RefsIndex> {
        return RefsIndex.hasPackedRefs(repo)
        .then(hasPackedRefs => (
            hasPackedRefs?
                RefsIndex.readPackedFromRepository(repo) :
                RefsIndex.readRefsFromRepository(repo)
        ))
    }

    /*
     * Read the refs file from the repository.
     */
    static readRefsFromRepository(
        repo: Repository
    ): Promise<RefsIndex> {
        const { fs } = repo;
        const refspath = repo.resolveGitFile('refs');

        return fs.readTree(refspath, {
            prefix: repo.resolveGitFile('./')
        })
        .then(files => {
            return files.reduce(
                (prev, stat, filepath) => (
                    prev
                    .then((accu) => (
                        fs.read(repo.resolveGitFile(filepath))
                        .then(buf => (
                            accu.set(filepath, Ref.createFromBuffer(buf))
                        ))
                    ))
                ),
                Promise.resolve(
                    new OrderedMap()
                )
            );
        })

        .then((refs) => new RefsIndex({ refs }));
    }

    /*
     * Read the packed index from the repository.
     */
    static readPackedFromRepository(
        repo: Repository
    ): Promise<RefsIndex> {
        const { fs } = repo;
        const filepath = repo.resolveGitFile(PACKED_FILE);

        return fs.read(filepath)
        .then(buf => RefsIndex.createFromPack(buf.toString('utf8')));
    }

    /*
     * Check if the repository has a packed-refs file.
     */
    static hasPackedRefs(
        repo: Repository
    ): Promise<boolean> {
        const { fs } = repo;
        const filepath = repo.resolveGitFile(PACKED_FILE);

        return fs.exists(filepath);
    }

    /*
     * Create the refs index from the content of a packed-refs file.
     */
    static createFromPack(content: string): Ref {
        const regex = /^([0-9a-f]{40})\s+(\S+)$/mg;
        let matches;
        let refs = new OrderedMap();

        while ((matches = regex.exec(content)) !== null) {
            if (matches.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            const commit = matches[1];
            const refName = matches[2];

            refs = refs.set(refName, new Ref({ commit }));
        }

        return new RefsIndex({
            refs
        });
    }
}

export default RefsIndex;
