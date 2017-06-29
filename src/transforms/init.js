/** @flow */

import path from 'path';
import { Head } from '../';
import type GitKit from '../GitKit';

/*
 * Transforms to init a repo.
 */

const Transforms = {};

/*
 * Initialize the repository.
 */
Transforms.init = (gitkit: GitKit): Promise<*> => {
    const base = gitkit.repo.isBare ? '' : '.git';

    return (
        gitkit
            .readHEAD()
            .then(
                () => {
                    throw new Error('Directory is already a git repository');
                },
                () => Promise.resolve()
            )
            .then(() => gitkit.mkdir(base))
            .then(() =>
                Promise.all([
                    gitkit.mkdir(path.join(base, 'objects')),
                    gitkit.mkdir(path.join(base, 'refs/heads')),
                    gitkit.mkdir(path.join(base, 'hooks'))
                ])
            )
            // Write files
            .then(() => {
                const head = new Head({ ref: 'refs/heads/master' });
                return head.writeToRepo(gitkit.repo, 'HEAD');
            })
    );
};

export default Transforms;
