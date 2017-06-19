import path from 'path';
import fs from 'fs';

import Author from '../Author';
import Commit from '../Commit';
import GitObject from '../GitObject';

describe('.createFromObject', () => {
    let commit;

    beforeAll(() => {
        const dataPath = path.join(
            __dirname,
            'data/commit-bbe781d8f1cdffd26e504af8c66e097ad7dc8003'
        );
        const buf = fs.readFileSync(dataPath);
        const obj = GitObject.createFromZip(buf);

        commit = Commit.createFromObject(obj);
    });

    it('should parse right message', () => {
        expect(commit.message).toBe('Add path for git objects');
    });

    it('should parse tree sha', () => {
        expect(commit.tree).toBe('266e71686f9a0fc884477274bfab6448ce04a7a3');
    });

    it('should parse parents list', () => {
        expect(commit.parents.toJS()).toEqual([
            'f38b2026ad9ef2c9bbd7041d4feaf97bf6632b7f',
        ]);
    });

    it('should parse the author/committer', () => {
        expect(commit.author).toBeInstanceOf(Author);
        expect(commit.committer).toBeInstanceOf(Author);

        expect(commit.author.name).toBe('Samy Pessé');
        expect(commit.author.email).toBe('samypesse@gmail.com');
    });
});
