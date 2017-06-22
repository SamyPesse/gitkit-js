/* @flow */

import Debug from 'debug';
import type Repository from './Repository';
import Transforms from '../transforms';

const debug = Debug('gitkit:transform');

class Transform {
    initialRepo: Repository;
    repo: Repository;

    constructor(repo: Repository) {
        this.initialRepo = Repository;
        this.repo = Repository;
        this.operations = [];
    }
}

/*
 * Bind all transforms.
 */
Object.keys(Transforms).forEach(type => {
    Transform.prototype[type] = function transform(...args) {
        debug(type, { args });
        Transforms[type](this, ...args);
        return this;
    };
});

export default Transform;
