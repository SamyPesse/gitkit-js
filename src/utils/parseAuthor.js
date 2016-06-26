var AUTHOR_RE = /(.*) <([^>]+)> (\d+) ([+-]{1}\d{4})/;

/**
 * Parse an author line
 *
 * @param {String} str
 * @return {Object}
 */
function parseAuthor(str) {
    var match = AUTHOR_RE.exec(str);
    if (!match) return null;

    return {
        name: match[1].replace(/(^\s+|\s+$)/, ''),
        email: match[2],
        timestamp: parseInt(match[3], 10),
        timezone: match[4]
    };
}

module.exports = parseAuthor;
