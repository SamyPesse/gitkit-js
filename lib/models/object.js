var Immutable = require('immutable');
var Buffer = require('buffer').Buffer;
var path = require('path');

var buffer = require('../utils/buffer');
var sha1 = require('../utils/sha1');

var TYPES = {
    TREE: 'tree',
    BLOB: 'blob',
    COMMIT: 'commit'
};

var GitObject = Immutable.Record({
    type: String(),
    content: Buffer('')
});

GitObject.prototype.getType = function() {
    return this.get('type');
};

GitObject.prototype.getContent = function() {
    return this.get('content');
};

GitObject.prototype.isTree = function() {
    return this.getType() === TYPES.TREE;
};

GitObject.prototype.isBlob = function() {
    return this.getType() === TYPES.BLOB;
};

GitObject.prototype.isCommit = function() {
    return this.getType() === TYPES.COMMIT;
};


/*
    Calcul the sha of this object

    @return {String}
*/
GitObject.prototype.getSha = function() {
    return sha1.encode(this.getAsBuffer());
};

/*
    Return this git object as a buffer

    @param {Buffer}
*/
GitObject.prototype.getAsBuffer = function() {
    var type = this.getType();
    var content = this.getContent();

    var nullBuf = new Buffer(1);
    nullBuf.fill(0);

    return Buffer.concat([
        (new Buffer(type + ' ' + content.length, 'utf8')),
        nullBuf,
        content
    ]);
};

/*
    Return path to an object by its sha

    @paran {String} sha
    @return {String}
*/
GitObject.getPath = function(sha) {
    return path.join('objects', sha.slice(0, 2), sha.slice(2));
};

/*
    Read an object from a repository using its SHA

    @param {Repository} repo
    @paran {String} sha
    @return {Promise<GitObject>}
*/
GitObject.readFromRepo = function(repo, sha) {
    var objectPath = GitObject.getPath(sha);

    return repo.readGitFile(objectPath)
        .then(GitObject.createFromZip);
};

/*
    Create a Git object from a zip content

    @param {Buffer} content
    @return {Promise<GitObject>}
*/
GitObject.createFromZip = function(content) {
    return buffer.unzip(content)
        .then(GitObject.createFromBuffer);
};

/*
    Create a Git object from a zip content

    @param {Buffer} content
    @return {GitObject}
*/
GitObject.createFromBuffer = function(content) {
    var nullChar = content.indexOf(0);

    // Parse object header
    var header = content.slice(0, nullChar).toString();
    var type = header.split(' ')[0];

    // Extract content
    var innerContent = content.slice(nullChar + 1);

    return new GitObject({
        type: type,
        content: innerContent
    });
};

/*
    Write a git object in a repository.
    It returns the new sha of this object.

    @param {Repository} repo
    @param {GitObject} obj
    @return {Promise<String>}
*/
GitObject.writeToRepo = function(repo, obj) {
    // Output object as a buffer
    var content = obj.getAsBuffer();

    // Calcul sha1 for the buffer
    var sha = sha1.encode(content);

    // Calcul path for this sha
    var objectPath = GitObject.getPath(sha);

    // Zip the buffer
    return buffer.zip(content)

        // Write the corresponding file
        .then(function(zipBuffer) {
            return repo.writeGitFile(objectPath, zipBuffer);
        })

        .thenResolve(sha);
};

/*
    Create a Git object from a content and a type

    @param {Buffer} content
    @return {GitObject}
*/
GitObject.create = function(type, content) {
    return new GitObject({
        type: type,
        content: content
    });
};

module.exports = GitObject;
module.exports.TYPES = TYPES;
