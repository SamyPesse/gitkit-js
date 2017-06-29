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
        expect(discovery.capabilities.toJS()).toContain('multi_ack');
    });

    it('should list refs', () => {
        expect(discovery.refs.has('HEAD')).toEqual(true);
        expect(discovery.refs.has('refs/tags/0.1.0')).toEqual(true);
    });
});
