import path from 'path';
import fs from 'fs';

import GitObject from '../GitObject';

describe('.sha', () => {
    test('it should encode it correctly', () => {
        const o = new GitObject({
            type: 'blob',
            content: new Buffer('Hello world', 'utf8'),
        });

        expect(o.sha).toBe('70c379b63ffa0795fdbfbc128e5a2818397b7ef8');
    });
});

describe('.path', () => {
    test('it should return correct path', () => {
        const o = new GitObject({
            type: 'blob',
            content: new Buffer('Hello', 'utf8'),
        });

        expect(o.sha).toBe('5ab2f8a4323abafb10abb68657d9d39f1a775057');
        expect(o.path).toBe(
            'objects/5a/b2f8a4323abafb10abb68657d9d39f1a775057'
        );
    });
});

describe('.createFromZip', () => {
    it('should detect type "tree"', () => {
        const dataPath = path.join(
            __dirname,
            'data/tree-2bd3640faa3f7e0c7a644c9ca475b30b62e9e62c'
        );
        const buf = fs.readFileSync(dataPath);

        const obj = GitObject.createFromZip(buf);

        expect(obj.type).toBe('tree');
        expect(obj.length).toBe(446);
    });

    it('should detect type "commit"', () => {
        const dataPath = path.join(
            __dirname,
            'data/commit-bbe781d8f1cdffd26e504af8c66e097ad7dc8003'
        );
        const buf = fs.readFileSync(dataPath);

        const obj = GitObject.createFromZip(buf);

        expect(obj.type).toBe('commit');
        expect(obj.length).toBe(239);
    });
});
