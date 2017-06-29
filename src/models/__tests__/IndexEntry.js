import IndexEntry from '../IndexEntry';

describe('toBuffer', () => {
    test('it generate the right buffer', () => {
        const entry = new IndexEntry({
            path: 'README.md',
            fileSize: 10,
            sha: '802992c4220de19a90767f3000a79a31b98d0df7'
        });

        const buffer = entry.toBuffer(2);
    });
});
