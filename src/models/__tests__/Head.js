import Head from '../Head';

describe('createFromString', () => {
    test('it should parse ref HEAD', () => {
        const head = Head.createFromString(
            'ref: refs/heads/master\n'
        );

        expect(head.ref).toBe('refs/heads/master');
        expect(head.commit).toBe(null);
    });

    test('it should parse detached HEAD', () => {
        const head = Head.createFromString(
            '8a3493eea604510d7ba532cce73bf0fb68c6db8f\n'
        );

        expect(head.commit).toBe('8a3493eea604510d7ba532cce73bf0fb68c6db8f');
        expect(head.ref).toBe(null);
    });
});
