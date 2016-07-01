var parseDiscovery = require('../parseDiscovery');

describe('parseDiscovery', function() {
    it('should parse capabilities and refs', function() {
        var stream = fixtures.createReadStream('discovery-http-output');

        return parseDiscovery(
            stream
        )
        .then(function(out) {
            expect(out).toExist();
            expect(out.capabilities).toExist();
            expect(out.capabilities).toEqual([
                'multi_ack',
                'thin-pack',
                'side-band',
                'side-band-64k',
                'ofs-delta',
                'shallow',
                'no-progress',
                'include-tag',
                'multi_ack_detailed',
                'no-done',
                'symref=HEAD:refs/heads/master',
                'agent=git/2:2.6.5+github-1394-g163a735'
            ]);

            expect(out.refs).toExist();
            expect(out.refs.size).toBe(422);

            expect(out.refs.get('HEAD').getCommit()).toBe('ba182ce8e430f08bd8c60865b9c853875a3d6483');
            expect(out.refs.get('refs/heads/master').getCommit()).toBe('ba182ce8e430f08bd8c60865b9c853875a3d6483');
            expect(out.refs.get('refs/tags/2.5.1').getCommit()).toBe('3388be9db6c6ae2173652df20eb98f36186c1f9a');
        });
    });
});
