var Immutable = require('immutable');
var Ref = require('../../models/ref');

var parsePktLines = require('./parsePktLines');

/*
    Parses the response to /info/refs?service=git-upload-pack, which contains ids for
    refs/heads and a capability listing for this git HTTP server.

    The returned stream emits data for each line.
    It also emit a "capabilities" event

    @param {Stream<Buffer>} input
    @return {Object<refs,capabilties>}
*/
function parseDiscovery(input) {
    var capabilities;
    var refs = new Immutable.OrderedMap();
    var i = 0;

    input.pipe(parsePktLines)
        .on('data', function(buf) {
            i++;

            if (i < 2) return;

            var line = buf.toString('utf8').trim();
            var parts;

            if (i === 2) {
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
