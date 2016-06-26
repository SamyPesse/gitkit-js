var Immutable = require('immutable');

/**
 * Parse a map
 * Exemple: .git/HEAD or .git/refs/remotes/origin/HEAD
 *
 * @param {String}
 * @return {Map<String:String>}
 */
function parseMap(str) {
    var o = {};

    str.split('/n').forEach(function(line) {
        var parts = line.split(':');
        if (parts.length == 1) return;

        o[parts[0]] = parts.slice(1).join(':').trim();
    });

    return new Immutable.Map(o);
}

module.exports = parseMap;
