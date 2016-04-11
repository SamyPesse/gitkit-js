var Immutable = require('immutable');
var Buffer = require('buffer').Buffer;

var GitObject = require('./object');

var Blob = Immutable.Record({
    content: Buffer('')
});

/*
    Return the content as a buffer of this blob

    @return {Buffer}
*/
Blob.prototype.getContent = function() {
    return this.get('content');
};

/*
    Return the size of this blob

    @return {Number}
*/
Blob.prototype.getContentSize = function() {
    return this.getContent().length;
};

/*
    Transform this blob into a git object

    @return {GitObject}
*/
Blob.prototype.toGitObject = function() {
    return GitObject.create(GitObject.TYPES.BLOB, this.getContent());
};

/*
    Create a blob from a Buffer

    @param {Buffer} content
    @return {Blob}
*/
Blob.createFromBuffer = function(content) {
    return new Blob({
        content: content
    });
};

/*
    Create a blob from a String

    @param {String} content
    @return {Blob}
*/
Blob.createFromString = function(content) {
    return Blob.createFromBuffer(new Buffer(content, 'utf8'));
};

/*
    Create a blob from a GitObject

    @param {GitObject} obj
    @return {Blob}
*/
Blob.createFromObject = function(obj) {
    return Blob.createFromBuffer(obj.getContent());
};

/*
    Read a blob by its sha from a repository

    @param {Repository} repo
    @param {String} sha
    @return {Promise<Blob>}
*/
Blob.readFromRepo = function(repo, sha) {
    return GitObject.readFromRepo(repo, sha)
        .then(function(obj) {
            if (!obj.isBlob()) {
                throw new Error('Object "' + sha + '" is not a blob');
            }

            return Blob.createFromObject(obj);
        });
};

/*
    Write a blob in a repository.
    It returns the new sha of this blob.

    @param {Repository} repo
    @param {Blob} blob
    @return {Promise<String>}
*/
Blob.writeToRepo = function(repo, blob) {
    var gitObject = blob.toGitObject();
    return GitObject.writeToRepo(gitObject);
};

module.exports = Blob;
