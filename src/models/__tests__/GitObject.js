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
