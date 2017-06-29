import Ref from '../Ref';

describe('createFromString', () => {
    test('it should parse ref HEAD', () => {
        const head = Ref.createFromString('ref: refs/heads/master\n');

        expect(head.ref).toBe('refs/heads/master');
        expect(head.commit).toBe(null);
    });

    test('it should parse detached HEAD', () => {
        const head = Ref.createFromString(
            '8a3493eea604510d7ba532cce73bf0fb68c6db8f\n'
        );

        expect(head.commit).toBe('8a3493eea604510d7ba532cce73bf0fb68c6db8f');
        expect(head.ref).toBe(null);
    });
});

describe('createFromBuffer', () => {
    test('it should parse ref HEAD', () => {
        const head = Ref.createFromBuffer(
            new Buffer('ref: refs/heads/master\n', 'utf8')
        );

        expect(head.ref).toBe('refs/heads/master');
        expect(head.commit).toBe(null);
    });
});
