/** @flow */

import path from 'path';
import { Blob, Tree, Commit } from '../models';
import type { GitObject, TreeEntry } from '../models';
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
        if (iter(commit, sha) == false) {
            return false;
        }

        return commit.parents.reduce(
            (prev, parent) => prev.then(() => gitkit.walkCommits(parent, iter)),
            Promise.resolve()
        );
    });
/*
 * Iterate over tree.
 */
Transforms.walkTree = (
    gitkit: GitKit,
    sha: SHA,
    iter: (entry: TreeEntry, filepath: string) => *,
    baseName: string = ''
): Promise<*> =>
    gitkit.readTree(sha).then(tree => {
        const { entries } = tree;

        return entries.reduce((prev, entry) => {
            const filepath = path.join(baseName, entry.path);
            if (!entry.isTree) {
                return iter(entry, filepath);
            }
            return gitkit.walkTree(entry.sha, iter, filepath);
        }, Promise.resolve());
    });

export default Transforms;
