/** @flow */

import { Record, OrderedMap } from 'immutable';
import Dissolve from 'dissolve';
import GitObject from './GitObject';
import TreeEntry from './TreeEntry';
import { scan } from '../utils/buffer';

import type { GitObjectSerializable } from './GitObject';

const DEFAULTS: {
    entries: OrderedMap<string, TreeEntry>,
} = {
    entries: new OrderedMap(),
};

class Tree extends Record(DEFAULTS) implements GitObjectSerializable<Tree> {
    /*
     * Parse a tree listing from a buffer.
     */
    static createFromBuffer(buffer: Buffer): Tree {
        let entries = new OrderedMap();

        Dissolve()
            .loop(function() {
                scan(this, 'mode', ' ');
                scan(this, 'path', new Buffer([0]));
                this.buffer('sha', 20);

                this.tap(function() {
                    entries = entries.set(
                        this.vars.path,
                        new TreeEntry({
                            path: this.vars.path.toString('utf8'),
                            mode: this.vars.mode,
                            sha: this.vars.sha.toString('hex'),
                        })
                    );
                });
            })
            .write(buffer);

        return new Tree({
            entries,
        });
    }

    /*
     * Create a blob from a git object.
     */
    static createFromObject(o: GitObject): Tree {
        return Tree.createFromBuffer(o.content);
    }
}

export default Tree;
