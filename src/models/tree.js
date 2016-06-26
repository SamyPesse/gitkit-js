var is = require('is');
var Immutable = require('immutable');
var Dissolve = require('dissolve');
var Buffer = require('buffer').Buffer;

var TreeEntry = require('./treeEntry');
var GitObject = require('./object');
var scan = require('../utils/scan');

import type Repository from './repo';
import type GitObject from './object';
type TreeEntries = OrderedMap<string, TreeEntry>;

const defaultRecord: {
    entries: TreeEntries
} = {
    entries: Immutable.OrderedMap()
};

class Tree extends Immutable.Record(defaultRecord) {
    getEntries() {
        return this.get('entries');
    }

    /**
     * Parse a tree from a Buffer
     *
     * @param {Buffer} content
     * @return {Tree}
     */
    static createFromBuffer(content: Buffer) : Tree {
        var entriesMap = {};
        var parser = Dissolve()
            .loop(function() {
                scan(this, 'mode', ' ');
                scan(this, 'path', new Buffer([0]));
                this.buffer('sha', 20);

                this.tap(function() {
                    entriesMap[this.vars.path] = new TreeEntry({
                        path: this.vars.path,
                        mode: this.vars.mode,
                        sha: this.vars.sha.toString('hex')
                    });
                });
            });

        parser.write(content);

        return new Tree({
            entries: Immutable.OrderedMap(entriesMap)
        });
    }

    /**
     * Parse a tree from a GitObject
     *
     * @param {GitObject} obj
     * @return {Tree}
     */
    static createFromObject(obj: GitObject) : Tree {
        return Tree.createFromBuffer(obj.getContent());
    }

    /**
     * Create a tree using a list of entries
     *
     * @param {Array<TreeEntry>|List<TreeEntry>} arr
     * @return {Tree}
     */
    static create(arr: Array<TreeEntry>|Immutable.List<TreeEntry>) : Tree {
        if (!is.array(arr)) {
            arr = arr.toJS();
        }

        return new Tree({
            entries: Immutable.OrderedMap(arr.map(function(entry) {
                return [entry.getPath(), entry];
            }))
        });
    }

    /**
     * Read a tree object by its sha from a repository
     *
     * @param {Repository} repo
     * @param {String} sha
     * @return {Promise<Tree>}
     */
    static readFromRepo(repo: Repository, sha: string) : Promise<Tree> {
        return GitObject.readFromRepo(repo, sha)
            .then(function(obj) {
                if (!obj.isTree()) {
                    throw new Error('Object "' + sha + '" is not a tree');
                }

                return Tree.createFromObject(obj);
            });
    }
}

module.exports = Tree;
