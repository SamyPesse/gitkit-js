/** @flow */

import pad from 'pad';
import { Record } from 'immutable';

import type Person from './Person';

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
