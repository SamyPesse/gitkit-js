/** @flow */

import { Blob, Tree, Commit } from '../models';
import type { GitObject } from '../models';
import type { SHA } from '../types/SHA';
import type GitKit from '../GitKit';

/*
 * Low-level operations for objects.
 */

const Transforms = {};

Transforms.indexObjects = (gitkit: GitKit): Promise<*> =>
    gitkit.repo.indexObjects().then(repo => (gitkit.repo = repo));

/*
 * Read an object from the database.
 */
Transforms.readObject = (gitkit: GitKit, sha: SHA): Promise<GitObject> =>
    gitkit.repo.readObject(sha).then(repo => {
        gitkit.repo = repo;
        return repo.objects.getObject(sha);
    });

Transforms.readCommit = (gitkit: GitKit, sha: SHA): Promise<Commit> =>
    gitkit.readObject(sha).then(object => Commit.createFromObject(object));

Transforms.readTree = (gitkit: GitKit, sha: SHA): Promise<Tree> =>
    gitkit.readObject(sha).then(object => Tree.createFromObject(object));

Transforms.readBlob = (gitkit: GitKit, sha: SHA): Promise<Blob> =>
    gitkit.readObject(sha).then(object => Blob.createFromObject(object));

/*
 * Create a new git object.
 */
Transforms.addObject = (gitkit: GitKit, object: GitObject): GitKit => {
    const { repo } = gitkit;
    const { objects } = repo;

    gitkit.repo = repo.merge({
        objects: objects.addObject(objects)
    });

    return gitkit;
};

Transforms.addBlob = (gitkit: GitKit, blob: Blob): GitKit => {
    gitkit.addObject(blob.toGitObject());
};

Transforms.addTree = (gitkit: GitKit, tree: Tree): GitKit => {
    gitkit.addObject(tree.toGitObject());
};

Transforms.addCommit = (gitkit: GitKit, commit: Commit): GitKit => {
    gitkit.addObject(commit.toGitObject());
};

/*
 * Flush all "pending" git objects form the transform to the disk.
 */
Transforms.flushObjects = (gitkit: GitKit): Promise<*> => {
    const { repo, initialRepo } = gitkit;
    const { objects } = repo;
    const { objects: initialObjects } = initialRepo;

    return objects.objects.reduce((prev, object, sha) => {
        if (initialObjects.hasObject(sha)) {
            return prev;
        }

        return prev.then(() => objects.writeObjectToRepository(repo));
    }, Promise.resolve());
};

/*
 * Iterate over commits.
 */
Transforms.walkCommits = (
    gitkit: GitKit,
    sha: SHA,
    iter: (commit: Commit, sha: SHA) => ?boolean
): Promise<*> =>
    gitkit.readCommit(sha).then(commit => {
        if (!commit) {
            return;
        }

        if (iter(commit, sha) == false) {
            return;
        }

        return commit.parents.reduce(
            (prev, parent) => prev.then(() => gitkit.walkCommits(parent, iter)),
            Promise.resolve()
        );
    });

export default Transforms;
