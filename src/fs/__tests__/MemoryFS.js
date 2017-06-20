import MemoryFS from '../MemoryFS';

let fs;

beforeAll(() => {
    fs = new MemoryFS();
});

describe('.write', () => {
    test('it should create the file if does not exist', () => {
        return fs
            .write('README.md', new Buffer('Hello world', 'utf8'))
            .then(() => {
                return expect(
                    fs.read('README.md').then(buf => buf.toString('utf8'))
                ).resolves.toBe('Hello world');
            });
    });

    test('it should create a file in a directory', () => {
        return fs
            .write('folder/README.md', new Buffer('Hello world 2', 'utf8'))
            .then(() => {
                return expect(
                    fs
                        .read('folder/README.md')
                        .then(buf => buf.toString('utf8'))
                ).resolves.toBe('Hello world 2');
            });
    });
});

describe('.read', () => {
    test('it should throw for a non existing file', () => {
        return expect(fs.read('README_NOTEXIST.md')).rejects.toBeDefined();
    });
});
