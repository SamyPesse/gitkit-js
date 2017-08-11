import Head from '../Head';

describe('isDetached', () => {
    test('it should be true when pointing to a commit', () => {
        const head = new Head({
            commit: '8a3493eea604510d7ba532cce73bf0fb68c6db8f'
        });

        expect(head.isDetached).toBe(true);
    });

    test('it should be false when pointing to a ref', () => {
        const head = new Head({
            ref: 'refs/heads/master'
        });

        expect(head.isDetached).toBe(false);
    });
});
