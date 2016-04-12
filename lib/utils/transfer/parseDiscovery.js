var Immutable = require('immutable');
var Ref = require('../../models/ref');

/*
    Parses the response to /info/refs?service=git-upload-pack, which contains ids for
    refs/heads and a capability listing for this git HTTP server.

    @param {Buffer}
    @return {Object}
*/
function parseDiscovery(buf) {
    var data = buf.toString('utf8');
    var lines = data.split('\n').slice(1);

    var capabilities;
    var refs = new Immutable.OrderedMap();

    lines.forEach(function(line, i) {
        var name, sha;
        var bits, bits2;

        if (i == 0) {
            bits = line.split('\0');
            capabilities = bits[1];

            bits2 = bits[0].split(' ');
            name = bits2[1];
            sha = bits2[0].substring(8);
        }
        else {
            bits2 = line.split(' ');
            name = bits2[1];
            sha = bits2[0].substring(4);
        }

        if (!name) return;
        refs = refs.set(name, Ref.createForCommit(sha));
    });

    return {
        capabilities: capabilities,
        refs: refs
    };
}

module.exports = parseDiscovery;
