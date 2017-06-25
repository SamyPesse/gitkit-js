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

    it('should list all objects', () => {
        expect(index.objects.size).toBe(481);
    });

    it('should parse the CRC (1)', () => {
        const obj = index.objects.get(
            'fcb5fc5bb3552658b1d29448fa435c99387fe99c'
        );
        expect(obj).toBeDefined();
        expect(obj.crc).toBe(-1699773302);
    });

    it('should parse the CRC (2)', () => {
        const obj = index.objects.get(
            'fe9fdab42e582b503e978f4747e6dad68ec9c416'
        );
        expect(obj).toBeDefined();
        expect(obj.crc).toBe(1923035264);
    });

    it('should parse the offset (1)', () => {
        const obj = index.objects.get(
            'f6b3ef3db34f7bb01760a439a900fa30c27b8df9'
        );
        expect(obj).toBeDefined();
        expect(obj.offset).toBe(47833);
    });

    it('should parse the offset (2)', () => {
        const obj = index.objects.get(
            'fad8f5c2bbfc62c530786a7a3ab8eaceaa1f21f8'
        );
        expect(obj).toBeDefined();
        expect(obj.offset).toBe(31935);
    });
});
