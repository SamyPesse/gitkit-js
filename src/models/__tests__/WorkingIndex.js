import path from 'path';
import fs from 'fs';

import WorkingIndex from '../WorkingIndex';

describe('.createFromBuffer', () => {
    let index;

    beforeAll(() => {
        const dataPath = path.join(__dirname, 'data/index');
        const buf = fs.readFileSync(dataPath);

        index = WorkingIndex.createFromBuffer(buf);
    });

    it('should parse correct version', () => {
        expect(index.version).toBe(2);
    });

    it('should extract all entries', () => {
        expect(index.entries.size).toBe(55);
    });

    it('should have the right files', () => {
        expect(index.entries.has('.babelrc')).toBe(true);
        expect(index.entries.has('yarn.lock')).toBe(true);
        expect(index.entries.has('src/models/Author.js')).toBe(true);
    });
});
