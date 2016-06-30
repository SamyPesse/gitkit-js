// @flow
var parseDiscovery = require('./parseDiscovery');

import type Transport from '../transport/base';
import type Discovery from './types/discovery';

/*
 * Fetch refs and capabilities from a remote repository
 *
 * @param {Transport}
 * @return {Promise<Discovery>}
 */
function fetchDiscovery(transport: Transport) : Promise<Discovery> {
    return transport.getWithUploadPack('info/refs')
        .then(parseDiscovery);
}

module.exports = fetchDiscovery;
