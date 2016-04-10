var Immutable = require('immutable');
var path = require('path');

var Ref = Immutable.Record({
    commit: String()
});

Ref.prototype.getCommit = function() {
    return this.get('commit');
};

/*
    Output the reference as a string

    @return {String}
*/
Ref.prototype.toString = function() {
    return this.getCommit() + '\n';
};

/*
    Return path to a ref by its sha

    @paran {String} name
    @return {String}
*/
Ref.getPath = function(name) {
    return path.join('refs', name);
};

/*
    Parse a ref from a String

    @param {String} content
    @return {Ref}
*/
Ref.createFromString = function(content) {
    var sha = content.trim();

    return new Ref({
        commit: sha
    });
};

/*
    Parse a ref from a Buffer

    @param {Buffer} content
    @return {Ref}
*/
Ref.createFromBuffer = function(content) {
    return Ref.createFromString(content.toString('utf8'));
};

/*
    Read a ref from a repository using its name

    @param {Repository} repo
    @paran {String} name
    @return {Promise<Ref>}
*/
Ref.readFromRepoByName = function(repo, name) {
    var refPath = Ref.getPath(name);
    return Ref.readFromRepo(repo, refPath);
};

/*
    Read a ref from a repository using its filename

    @param {Repository} repo
    @paran {String} refPath
    @return {Promise<Ref>}
*/
Ref.readFromRepo = function(repo, refPath) {
    return repo.readGitFile(refPath)
        .then(Ref.createFromBuffer);
};

module.exports = Ref;
