// @flow

var Immutable = require('immutable');

var defaultRecord: {
    name:  string,
    email: string
} = {
    name:  '',
    email: ''
};

class Person extends Immutable.Record(defaultRecord) {
    getName() : string {
        return this.get('name');
    }

    getEmail() : string {
        return this.get('email');
    }

    /*
     * Create a person using a name and email.
     *
     * @param {String} name
     * @param {String} email
     * @return {Person}
     */
    static create(name, email) {
        return new Person({
            name: name,
            email: email
        });
    }
}

module.exports = Person;
