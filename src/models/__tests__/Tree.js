import path from 'path';
import fs from 'fs';

import Tree from '../Tree';
import GitObject from '../GitObject';

describe('.createFromObject', () => {
    let tree;

    beforeAll(() => {
        const dataPath = path.join(__dirname, 'data/tree-2bd3640faa3f7e0c7a644c9ca475b30b62e9e62c')
        const buf = fs.readFileSync(dataPath);
        const obj = GitObject.createFromZip(buf);

        tree = Tree.createFromObject(obj);
    });

    it('should decode the right number of entries', () => {
        expect(tree.entries.size).toBe(12);
    });

    it('should detect the mode of entries', () => {
        const treeEntry = tree.entries.get('src');
        const blobEntry = tree.entries.get('package.json');

        expect(treeEntry.mode).toBe(40000);
        expect(blobEntry.mode).toBe(100644);
    });

    it('should detect the type of entries', () => {
        const blobs = tree.entries.filter(entry => entry.isBlob);
        const trees = tree.entries.filter(entry => entry.isTree);

        expect(blobs.size).toBe(11);
        expect(trees.size).toBe(1);
    });

});
