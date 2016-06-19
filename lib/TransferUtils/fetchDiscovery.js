var parseDiscovery = require('./parseDiscovery');

/*
 * Fetch refs and capabilities from a remote repository
 *
 * @param {Transport}
 * @return {Promise<Discovery>}
 */
function fetchDiscovery(transport) {
    return transport.getWithUploadPack('info/refs')
        .then(parseDiscovery);
}

module.exports = fetchDiscovery;
