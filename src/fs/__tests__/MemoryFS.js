import MemoryFS from '../MemoryFS';

let fs;

beforeAll(() => {
    fs = new MemoryFS();
});

describe('.write', () => {
    test('it should create the file if does not exist', () => {
        return fs.write('README.md', new Buffer('Hello world', 'utf8'))
        .then(() => {
            return expect(
                fs.read('README.md')
                .then(buf => buf.toString('utf8'))
            ).resolves.toBe('Hello world');
        });
    });
});

describe('.read', () => {
    test('it should throw for a non existing file', () => {
        return expect(fs.read('README_NOTEXIST.md')).rejects.toBeDefined();
    });
});
