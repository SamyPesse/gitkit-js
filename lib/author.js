var _ = require('lodash');

var AUTHOR_RE = /(.*) <([^>]+)> (\d+) ([+-]{1}\d{4})/;

function Author(content) {
    if (!(this instanceof Author)) return new Author(content);

    if (_.isString(content)) this.parse(content);
}

// Convert author to a string
Author.prototype.toString = function() {
    return [
        this.name,
        '<' + this.email + '>',
        this.timestamp,
        this.timezone
    ].join(' ');
};

// Parse and update the object
Author.prototype.parse = function(str) {
    var parsed = Author.parse(str);
    if (!parsed) throw new Error('Invalid author content');

    _.extend(this, parsed);

    return this;
};

// Parse an author from a string
Author.parse = function(str) {
    var match = AUTHOR_RE.exec(str);
    if (!match) return null;

    return {
        name: match[1].replace(/(^\s+|\s+$)/, ''),
        email: match[2],
        timestamp: parseInt(match[3], 10),
        timezone: match[4]
    };
};

module.exports = Author;
