import path from 'path';
import fs from 'fs';

import PackFileIndex from '../PackFileIndex';

describe('.createFromBuffer', () => {
    let index;

    beforeAll(() => {
        const dataPath = path.join(__dirname, 'data/pack-version2.idx');
        const buf = fs.readFileSync(dataPath);

        index = PackFileIndex.createFromBuffer(buf);
    });

    it('should parse correct version', () => {
        expect(index.version).toBe(2);
    });
});
