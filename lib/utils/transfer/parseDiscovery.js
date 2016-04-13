var Immutable = require('immutable');
var Ref = require('../../models/ref');

var parsePktLines = require('./parsePktLines');

/*
    Parses the response to /info/refs?service=git-upload-pack, which contains ids for
    refs/heads and a capability listing for this git HTTP server.

    @param {Buffer}
    @return {Object}
*/
function parseDiscovery(buf) {
    var lines = parsePktLines(buf);

    var capabilities;
    var refs = new Immutable.OrderedMap();

    lines.forEach(function(buf, i) {
        if (i < 1) return;

        var line = buf.toString('utf8').trim();
        var parts;

        if (i === 1) {
            parts = line.split('\0');
            capabilities = parts[1];
            line = parts[0];
        }

        parts = line.split(' ');
        refs = refs.set(
            parts[1],
            Ref.createForCommit(parts[0])
        );
    });

    return {
        capabilities: capabilities,
        refs: refs
    };
}

module.exports = parseDiscovery;
