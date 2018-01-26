var Immutable = require('immutable');
var pad = require('pad');

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

/**
 * Convert an author to a string
 * @return {String}
 */
Author.prototype.toString = function() {
    return [
        this.name,
        '<' + this.email + '>',
        this.timestamp,
        this.timezone
    ].join(' ');
};

/**
 * Parse and create an author instance
 * @param {String} content
 * @return {Author|null}
 */
Author.createFromString = function createFromString(str) {
    var match = parseAuthor(str);
    if (!match) return null;

    return new Author(match);
};

/**
 * Create an author from a person
 * @param {Person} person
 * @param {Date} date
 * @return {Author}
 */
Author.createFromPerson = function createFromPerson(person, date) {
    var offset = new Date().getTimezoneOffset();
    offset = ((offset<=0? '+':'-') +
          pad(2, '' + parseInt(Math.abs(offset/60)), '0') +
          pad(2, '' + Math.abs(offset%60), '0'));

    return new Author({
        name: person.getName(),
        email: person.getEmail(),
        timezone: offset,
        timestamp: Number(date.getTime()/1000)
    });
};

module.exports = Author;
