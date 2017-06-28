/** @flow */

import type { Transform, GitObject, Blob, Tree, Commit } from '../models';
import type { SHA } from '../types/SHA';

/*
 * Low-level operations for objects.
 */

const Transforms = {};

/*
 * Read an object from the database.
 */
Transforms.readObject = (transform: Transform, sha: SHA): Promise<*> =>
    transform.repo.readObject(sha).then(repo => (transform.repo = repo));

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

/*
 * Flush all "pending" git objects form the transform to the disk.
 */
Transform.flushObjects = (transform: Transform) => {
    const { repo, initialRepo } = transform;
    const { objects } = repo;
    const { objects: initialObjects } = initialRepo;

    return objects.objects.reduce((prev, object, sha) => {
        if (initialObjects.hasObject(sha)) {
            return prev;
        }

        return prev.then(() => objects.writeObjectToRepository(repo));
    }, Promise.resolve());
};

export default Transforms;
