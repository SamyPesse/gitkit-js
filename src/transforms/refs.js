/** @flow */

import type { Transform, Ref } from '../models';

/*
 * Transforms to manipulate refs (branches and tags)
 */

const Transforms = {};

/*
 * Create a new ref.
 */
Transforms.updateRef = (transform: Transform, name: string, ref: Ref) => {
    const { repo } = transform;
    const { refs } = repo;

    transform.repo = repo.merge({
        refs: refs.setRef(name, ref)
    });
};

export default Transforms;
