var parseDiscovery = require('../lib/TransferUtils/parseDiscovery');
var fixtures = require('./fixtures');

describe('parseDiscovery', function() {
    var out;

    before(function() {
        return parseDiscovery(fixtures.createReadStream('discovery-http-output'))
        .then(function(_out) {
            out = _out;
        });
    });

    it('should parse capabilities', function() {
        out.should.have.property('capabilities');
        out.capabilities.should.deepEqual([
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
    });

    it('should parse list of refs', function() {
        out.should.have.property('refs');
        out.refs.size.should.equal(422);

        out.refs.get('HEAD').getCommit().should.equal('ba182ce8e430f08bd8c60865b9c853875a3d6483');
        out.refs.get('refs/heads/master').getCommit().should.equal('ba182ce8e430f08bd8c60865b9c853875a3d6483');
        out.refs.get('refs/tags/2.5.1').getCommit().should.equal('3388be9db6c6ae2173652df20eb98f36186c1f9a');
    });
});
