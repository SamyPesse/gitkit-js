var Immutable = require('immutable');
var path = require('path');

var Repository = Immutable.Record({
    bare: Boolean(false),
    fs: null
});

Repository.prototype.isBare = function() {
    return this.get('bare');
};

Repository.prototype.getFS = function() {
    return this.get('fs');
};

/*
    Read a file from the repository

    @param {String}
    @return {Buffer}
*/
Repository.prototype.readFile = function(filepath) {
    return this.getFS().read(filepath);
};

/*
    Get details about a file

    @param {String}
    @return {File}
*/
Repository.prototype.statFile = function(filepath) {
    return this.getFS().statFile(filepath);
};

/*
    Read a directory from the repository

    @param {String}
    @return {List<String>}
*/
Repository.prototype.readDir = function(filepath) {
    return this.getFS().readDir(filepath);
};

/*
    Get absolute path toa file related to the git content

    @param {String}
    @return {String}
*/
Repository.prototype.getGitPath = function(filepath) {
    return this.isBare()? filepath : path.join('.git', filepath);
};

/*
    Read a git file from the repository (file in the '.git' directory)

    @param {String}
    @return {Buffer}
*/
Repository.prototype.readGitFile = function(filepath) {
    filepath = this.getGitPath(filepath);
    return this.readFile(filepath);
};

/*
    Stat a git file from the repository (file in the '.git' directory)

    @param {String}
    @return {File}
*/
Repository.prototype.statGitFile = function(filepath) {
    filepath = this.getGitPath(filepath);
    return this.statFile(filepath);
};

/*
    List content of a directory (inside the .git)

    @param {String}
    @return {List<String>}
*/
Repository.prototype.readGitDir = function(filepath) {
    filepath = this.getGitPath(filepath);
    return this.readDir(filepath);
};

/*
    Create a repository with an fs instance

    @param {String}
    @return {Repository}
*/
Repository.createWithFS = function(fs) {
    return new Repository({
        fs: fs
    });
};

module.exports = Repository;
