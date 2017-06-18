import GitObject from '../GitObject';

describe('.sha', () => {

    test('it should encode it correctly', () => {
        const o = new GitObject({
            type: 'blob',
            content: new Buffer('Hello world', 'utf8')
        });

        expect(o.sha).toBe('70c379b63ffa0795fdbfbc128e5a2818397b7ef8');
    });

});
