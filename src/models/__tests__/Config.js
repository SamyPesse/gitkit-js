import Config from '../Config';

describe('createFromString', () => {
    const config = Config.createFromString(`[core]
	repositoryformatversion = 0
	filemode = true
	bare = false
	logallrefupdates = true
	ignorecase = true
	precomposeunicode = true
[remote "origin"]
	url = https://github.com/SamyPesse/gitkit-js.git
	fetch = +refs/heads/*:refs/remotes/origin/*
[branch "master"]
	remote = origin
	merge = refs/heads/master
[lfs "https://github.com/SamyPesse/gitkit-js.git/info/lfs"]
	access = basic
[branch "es6-flow"]
	remote = origin
	merge = refs/heads/es6-flow`);

    test('it should parse the core (boolean)', () => {
        expect(config.core.get('bare')).toBe(false);
        expect(config.core.get('filemode')).toBe(true);
    });

    test('it should parse the core (string)', () => {
        expect(config.core.get('repositoryformatversion')).toBe('0');
    });

    test('it should list all branches', () => {
        expect(config.branches.size).toBe(2);

        const master = config.branches.get('master');
        expect(master).toBeDefined();
        expect(master.remote).toEqual('origin');
        expect(master.merge).toEqual('refs/heads/master');
    });

    test('it should list all remotes', () => {
        expect(config.remotes.size).toBe(1);

        const remote = config.remotes.get('origin');
        expect(remote).toBeDefined();
        expect(remote.url).toEqual(
            'https://github.com/SamyPesse/gitkit-js.git'
        );
        expect(remote.fetch).toEqual('+refs/heads/*:refs/remotes/origin/*');
    });
});
