var Immutable = require('immutable');

var parseMap = require('../utils/parseMap');

var Head = Immutable.Record({
    ref: String()
});

Head.prototype.getRef = function() {
    return this.get('ref');
};

/*
    Output the head as a string

    @return {String}
*/
Head.prototype.toString = function() {
    return 'ref: ' + this.getRef() + '\n';
};

/*
    Parse a ref from a String

    @param {String} content
    @return {Head}
*/
Head.createFromString = function(content) {
    var map = parseMap(content);
    return Head.createForRef(map.get('ref'));
};

/*
    Create a head for a ref

    @param {String} ref
    @return {Head}
*/
Head.createForRef = function(ref) {
    return new Head({
        ref: ref
    });
};

/*
    Parse a head from a Buffer

    @param {Buffer} content
    @return {Head}
*/
Head.createFromBuffer = function(content) {
    return Head.createFromString(content.toString('utf8'));
};

/*
    Read a head from a repository using its path

    @param {Repository} repo
    @paran {String} filename
    @return {Promise<Head>}
*/
Head.readFromRepo = function(repo, filename) {
    filename = filename || 'HEAD';

    return repo.readGitFile(filename)
        .then(Head.createFromBuffer);
};

/*
    Write a head to a repository

    @param {Repository} repo
    @paran {String} filename
    @return {Promise<Head>}
*/
Head.writeToRepo = function(repo, head, filename) {
    filename = filename || 'HEAD';
    var headContent = head.toString();

    return repo.writeGitFile(filename, new Buffer(headContent, 'utf8'));
};

module.exports = Head;
