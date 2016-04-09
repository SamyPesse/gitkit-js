var Immutable = require('immutable');

var parseAuthor = require('../utils/parseAuthor');

var Author = Immutable.Record({
    name: String(),
    email: String(),
    timestamp: Number(),
    timezone: String()
});

Author.prototype.getName = function() {
    return this.get('name');
};

Author.prototype.getEmail = function() {
    return this.get('email');
};

Author.prototype.getTimestamp = function() {
    return this.get('timestamp');
};

Author.prototype.getTimezone = function() {
    return this.get('timezone');
};

/*
    Convert an author to a string

    @return {String}
*/
Author.prototype.toString = function() {
    return [
        this.name,
        '<' + this.email + '>',
        this.timestamp,
        this.timezone
    ].join(' ');
};

/*
    Parse and create an author instance

    @param {String} content
    @return {Author|null}
*/
Author.createFromString = function createFromString(str) {
    var match = parseAuthor(str);
    if (!match) return null;

    return new Author(match);
};

module.exports = Author;
