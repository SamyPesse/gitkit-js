var path = require('path');

var Git = require('../');
var NodeFS = require('../lib/fs/node');

var TMPDIR = path.join(__dirname, '../.tmp');
var TMP_NONBARE = path.join(TMPDIR, 'nonBare');
var TMP_BARE = path.join(TMPDIR, 'bare');

var bare = Git.Repository.createWithFS(
    NodeFS(TMP_BARE),
    true
);

var nonBare = Git.Repository.createWithFS(
    NodeFS(TMP_NONBARE),
    false
);

// Create a john doe person
var person = Git.Person.create('John Doe', 'john.doe@gmail.com');


module.exports = {
    bare: bare,
    nonBare: nonBare,
    person: person
};
