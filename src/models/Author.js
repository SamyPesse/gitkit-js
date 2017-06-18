/** @flow */

import pad from 'pad';
import { Record } from 'immutable';

import type Person from './Person';

const AUTHOR_RE = /(.*) <([^>]+)> (\d+) ([+-]{1}\d{4})/;

const DEFAULTS: {
    name: string,
    email: string,
    timezone: string,
    timestamp: number,
} = {
    name: '',
    email: '',
    timezone: '',
    timestamp: 0,
};

class Author extends Record(DEFAULTS) {
    static createFromString(str): ?Author {
        const match = AUTHOR_RE.exec(str);
        if (!match) {
            return null;
        }

        return new Author({
            name: match[1].replace(/(^\s+|\s+$)/, ''),
            email: match[2],
            timestamp: parseInt(match[3], 10),
            timezone: match[4],
        });
    }

    static createFromPerson(person: Person): Author {
        const date = new Date();
        const offset = date.getTimezoneOffset();
        const timezone =
            (offset < 0 ? '+' : '-') +
            pad('' + parseInt(Math.abs(offset / 60), 10), 2) +
            pad('' + Math.abs(offset % 60), 2);

        return new Author({
            name: person.name,
            email: person.email,
            timezone,
            timestamp: Number(date.getTime() / 1000),
        });
    }

    toString(): string {
        return `${this.name} <${this.email}> ${this.timestamp} ${this
            .timezone}`;
    }
}

export default Author;
