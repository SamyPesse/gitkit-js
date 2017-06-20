import RefsIndex from '../RefsIndex';

describe('createFromPack', () => {
    let index;

    test('it should parse withotu error', () => {
        index = RefsIndex.createFromPack(`# pack-refs with: peeled fully-peeled
931e905e0d5d250f4a8129600c390800cde77c08 refs/heads/es6-flow
277a149659ce5caa44db4da52ffca7332f31316a refs/heads/master
b5a03273eb4f3ba3e4feb5bdf3a34e1b889f67c7 refs/remotes/origin/es6-flow
6caa820b76605daddeeecac07d3289079d477ae0 refs/remotes/origin/examples/webapp
9363f8200d75ca91d359d457541df9a01d00544f refs/remotes/origin/flow
277a149659ce5caa44db4da52ffca7332f31316a refs/remotes/origin/master
aae050d2042be9115d2545dfa9ee3e8be65c9974 refs/tags/0.1.0
`);
    });

    test('it should parse all refs', () => {
        expect(index.refs.size).toBe(7);
    });

    test('it should correctly map', () => {
        const ref = index.refs.get('refs/heads/master');
        expect(ref).toBeDefined();
        expect(ref.commit).toBe('277a149659ce5caa44db4da52ffca7332f31316a');
    });

});
