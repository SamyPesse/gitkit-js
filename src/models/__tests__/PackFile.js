import path from 'path';
import fs from 'fs';

import PackFile from '../PackFile';

describe('.parseFromBuffer', () => {
    let pack;

    beforeAll(() => {
        const dataPath = path.join(__dirname, 'data/pack-version2.pack');
        const buf = fs.readFileSync(dataPath);

        pack = PackFile.parseFromBuffer(buf);
    });

    it('should parse correct version', () => {
        expect(pack.version).toBe(2);
    });

    it('should extract all objects', () => {
        expect(pack.objects.size).toBe(481);
    });

    it('should correctly extract not deltified object', () => {
        const tree = pack.objects.get('5e0a8cda1925e50779633a9137ecbae032c10010');
        expect(tree).toBeDefined();
        expect(tree.type).toBe('tree');
    });

    it('should correctly extract deltified object', () => {
        const blob = pack.objects.get('edf18bf82ff1fc90588a48e036706f49e045f1d1');
        expect(blob).toBeDefined();
        expect(blob.type).toBe('blob');
    });
});
