// @flow

var Immutable = require('immutable');
var pad = require('pad');

var parseAuthor = require('../utils/parseAuthor');

import type Person from './person';

var defaultRecord: {
    name:      string,
    email:     string,
    timezone:  string,
    timestamp: number,
} = {
    name:      '',
    email:     '',
    timestamp: 0,
    timezone:  ''
};

class Author extends Immutable.Record(defaultRecord) {
    getName() : string {
        return this.get('name');
    }
    getEmail() : string {
        return this.get('email');
    }
    getTimestamp() : number {
        return this.get('timestamp');
    }
    getTimezone() : number {
        return this.get('timezone');
    }

    /**
     * Convert an author to a string
     * @return {String}
     */
    toString() : string {
        return [
            this.getName(),
            '<' + this.getEmail() + '>',
            this.getTimestamp(),
            this.getTimezone()
        ].join(' ');
    }

    /**
     * Parse and create an author instance
     * @param {String} content
     * @return {Author|null}
     */
    static createFromString(str) : ?Author {
        var match = parseAuthor(str);
        if (!match) {
            return null;
        }

        return new Author(match);
    }

    /**
     * Create an author from a person
     * @param {Person} person
     * @param {Date} date
     * @return {Author}
     */
    static createFromPerson(person : Person, date : Date) : Author {
        var offset = new Date().getTimezoneOffset();
        offset = ((offset<0? '+':'-') +
              pad('' + parseInt(Math.abs(offset/60)), 2) +
              pad('' + Math.abs(offset%60), 2));

        return new Author({
            name: person.getName(),
            email: person.getEmail(),
            timezone: offset,
            timestamp: Number(date.getTime()/1000)
        });
    }
}

module.exports = Author;
