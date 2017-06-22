/** @flow */

import type { Transform, GitObject, Blob, Tree, Commit } from '../models';

/*
 * Low-level operations for objects.
 */

const Transforms = {};

/*
 * Create a new git object.
 */
Transforms.addObject = (transform: Transform, object: GitObject) => {
    const { repo } = transform;
    const { objects } = repo;

    transform.repo = repo.merge({
        objects: objects.addObject(objects)
    });
};

Transforms.addBlob = (transform: Transform, blob: Blob) => {
    transform.addObject(blob.toGitObject());
};

Transforms.addTree = (transform: Transform, tree: Tree) => {
    transform.addObject(tree.toGitObject());
};

Transforms.addCommit = (transform: Transform, commit: Commit) => {
    transform.addObject(commit.toGitObject());
};

export default Transforms;
