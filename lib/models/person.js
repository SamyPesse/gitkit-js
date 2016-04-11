var Immutable = require('immutable');

var Person = Immutable.Record({
    name: String(),
    email: String()
});

Person.prototype.getName = function() {
    return this.get('name');
};

Person.prototype.getEmail = function() {
    return this.get('email');
};


/*
    Create a person using a name and email.

    @param {String} name
    @param {String} email
    @return {Person}
*/
Person.create = function(name, email) {
    return new Person({
        name: name,
        email: email
    });
};

module.exports = Person;
