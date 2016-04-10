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
    Read a git file from the repository (file in the '.git' directory)

    @param {String}
    @return {Buffer}
*/
Repository.prototype.readGitFile = function(filepath) {
    filepath = this.isBare()? filepath : path.join('.git', filepath);
    return this.readFile(filepath);
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
