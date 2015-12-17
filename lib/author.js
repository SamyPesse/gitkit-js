var _ = require('lodash');

var parse = require('./utils/parse');

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
    var parsed = parse.author(str);
    if (!parsed) throw new Error('Invalid author content');

    _.extend(this, parsed);

    return this;
};

module.exports = Author;
