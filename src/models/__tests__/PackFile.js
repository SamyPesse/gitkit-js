import path from 'path';
import fs from 'fs';

import PackFile from '../PackFile';

describe('.parseFromBuffer', () => {
    let pack;

    beforeAll(() => {
        const dataPath = path.join(
            __dirname,
            'data/pack-version2'
        );
        const buf = fs.readFileSync(dataPath);

        pack = PackFile.parseFromBuffer(buf);
    });

    it('should parse correct version', () => {
        expect(pack.version).toBe(2);
    });
});
