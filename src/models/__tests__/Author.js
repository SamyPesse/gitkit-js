import Author from '../Author';

describe('createFromString', () => {
    test('it should parse all fields', () => {
        const author = Author.createFromString('Samy Pesse <samypesse@gmail.com> 1466463181 +0200');

        expect(author.name).toBe('Samy Pesse');
        expect(author.email).toBe('samypesse@gmail.com');
        expect(author.timestamp).toBe(1466463181);
        expect(author.timezone).toBe('+0200');
    });
});
