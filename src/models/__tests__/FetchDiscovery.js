import FetchDiscovery from '../FetchDiscovery';
import HTTPTransport from '../../transports/HTTPTransport';

describe('fetch', () => {
    let discovery;

    beforeAll(() => {
        const transport = new HTTPTransport(
            'https://github.com/SamyPesse/gitkit-js.git'
        );

        return FetchDiscovery.fetch(transport).then(
            result => (discovery = result)
        );
    });

    it('should parse capabilities', () => {
        expect(discovery.capabilities.toJS()).toEqual([
            'multi_ack',
            'thin-pack',
            'side-band',
            'side-band-64k',
            'ofs-delta',
            'shallow',
            'deepen-since',
            'deepen-not',
            'deepen-relative',
            'no-progress',
            'include-tag',
            'multi_ack_detailed',
            'no-done',
            'symref=HEAD:refs/heads/master',
            'agent=git/github-g4cf2b3a18'
        ]);
    });

    it('should list refs', () => {
        expect(discovery.refs.has('HEAD')).toEqual(true);
        expect(discovery.refs.has('refs/tags/0.1.0')).toEqual(true);
    });
});
