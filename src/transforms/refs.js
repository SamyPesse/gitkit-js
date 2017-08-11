/** @flow */

import type { Ref } from '../models';
import type GitKit from '../GitKit';

/*
 * Transforms to manipulate refs (branches and tags)
 */

const Transforms = {};

/*
 * Read the HEAD.
 */
Transforms.readHEAD = (gitkit: GitKit): Promise<*> =>
    gitkit.repo.readHEAD().then(repo => (gitkit.repo = repo));

Transforms.indexRefs = (gitkit: GitKit): Promise<*> =>
    gitkit.repo.indexRefs().then(repo => (gitkit.repo = repo));

/*
 * Create a new ref.
 */
Transforms.updateRef = (gitkit: GitKit, name: string, ref: Ref): GitKit => {
    const { repo } = gitkit;
    const { refs } = repo;

    gitkit.repo = repo.merge({
        refs: refs.setRef(name, ref)
    });

    return gitkit;
};

export default Transforms;
