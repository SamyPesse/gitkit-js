var Promise = require('q');
var Immutable = require('immutable');

var Ref = require('../models/ref');
var parsePktLines = require('./parsePktLines');
var parsePktLineMeta = require('./parsePktLineMeta');

/**
 * Parses the response to /info/refs?service=git-upload-pack, which contains ids for
 * refs/heads and a capability listing for this git HTTP server.
 *
 * The returned stream emits data for each line.
 * It also emit a "capabilities" event
 *
 * @param {Stream<Buffer>} input
 * @return {Promise<refs,capabilties>}
 */
function parseDiscovery(input) {
    var d = Promise.defer();
    var capabilities;
    var lineIndex = 0;
    var refs = new Immutable.OrderedMap();

    input.pipe(parsePktLines())
        .pipe(parsePktLineMeta())
        .on('data', function(line) {
            lineIndex++;

            if (line.caps && !capabilities) {
                capabilities = line.caps;
            }

            if (lineIndex === 1 || line.type !== parsePktLineMeta.TYPES.LINE) {
                return;
            }

            var content = line.toString('utf8').trim();
            var parts = content.split(' ');

            refs = refs.set(
                parts[1],
                Ref.createForCommit(parts[0])
            );
        })
        .on('error', function(err) {
            d.reject(err);
        })
        .on('end', function() {
            d.resolve({
                capabilities: capabilities,
                refs: refs
            });
        });

    return d.promise;
}

module.exports = parseDiscovery;
