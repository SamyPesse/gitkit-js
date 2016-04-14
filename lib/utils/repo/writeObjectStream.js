var through = require('through2');
var GitObject = require('../../models/object');

/*
    Write a stream of GitObject to a repository

    @param {Repository}
    @return {Stream}
*/
function writeObjectStream(repo) {
    return through(function(obj, enc, callback) {
        GitObject.writeToRepo(repo, obj)
        .nodeify(callback);
    });
}

module.exports = writeObjectStream;
