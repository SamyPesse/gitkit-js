/** @flow */

import path from 'path';
import { OrderedMap } from 'immutable';
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
Transforms.addObjects = (gitkit: GitKit, toAdd: GitObject): Promise<*> => {
    const { objects } = gitkit.repo;

    return toAdd
        .reduce(
            (prev, object) =>
                prev.then(_objects => {
                    const { sha } = object;

                    if (_objects.hasObject(sha)) {
                        return _objects;
                    }

                    return _objects
                        .writeObjectToRepository(gitkit.repo, object)
                        .then(() => _objects.addObject(object));
                }),
            Promise.resolve(objects)
        )
        .then(() => toAdd);
};

Transforms.addObject = (
    gitkit: GitKit,
    object: GitObject
): Promise<GitObject> =>
    gitkit.addObjects([object]).then(objects => objects[0]);

Transforms.addBlob = (gitkit: GitKit, blob: Blob): Promise<GitObject> =>
    gitkit.addObject(blob.toGitObject());

Transforms.addTree = (gitkit: GitKit, tree: Tree): Promise<GitObject> =>
    gitkit.addObject(tree.toGitObject());

Transforms.addCommit = (gitkit: GitKit, commit: Commit): Promise<GitObject> =>
    gitkit.addObject(commit.toGitObject());

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

        return entries.reduce(
            (prev, entry) =>
                prev.then(() => {
                    const filepath = path.join(baseName, entry.path);
                    if (!entry.isTree) {
                        return iter(entry, filepath);
                    }
                    return gitkit.walkTree(entry.sha, iter, filepath);
                }),
            Promise.resolve()
        );
    });

/*
 * Read an entire tree.
 * The returned Tree is not valid since it contains entire paths and only files entries.
 */
Transforms.readRecursiveTree = (gitkit: GitKit, sha: SHA): Promise<Tree> => {
    let entries = new OrderedMap();

    return gitkit
        .walkTree(sha, (entry, filepath) => {
            entries = entries.set(filepath, entry);
        })
        .then(() => new Tree({ entries }));
};

export default Transforms;
