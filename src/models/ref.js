var Immutable = require('immutable');
var path = require('path');

var Ref = Immutable.Record({
    commit: String()
});

Ref.prototype.getCommit = function() {
    return this.get('commit');
};

/**
 * Output the reference as a string
 * @return {String}
 */
Ref.prototype.toString = function() {
    return this.getCommit() + '\n';
};

/**
 * Output the reference as a buffer
 * @return {Buffer}
 */
Ref.prototype.toBuffer = function() {
    return new Buffer(this.toString(), 'utf8');
};

/**
 * Return path to a ref by its sha
 * @paran {String} name
 * @return {String}
 */
Ref.getPath = function(name) {
    return path.join('refs', name);
};

/**
 * Parse a ref from a String
 * @param {String} content
 * @return {Ref}
 */
Ref.createFromString = function(content) {
    var sha = content.trim();
    return Ref.createForCommit(sha);
};

/**
 * Parse a ref from a Buffer
 * @param {Buffer} content
 * @return {Ref}
 */
Ref.createFromBuffer = function(content) {
    return Ref.createFromString(content.toString('utf8'));
};

/**
 * Create ref using a commit sha
 * @param {String} sha
 * @return {Ref}
 */
Ref.createForCommit = function(sha) {
    return new Ref({
        commit: sha
    });
};

/**
 * Read a ref from a repository using its name
 * @param {Repository} repo
 * @paran {String} name
 * @return {Promise<Ref>}
 */
Ref.readFromRepoByName = function(repo, name) {
    var refPath = Ref.getPath(name);
    return Ref.readFromRepo(repo, refPath);
};

/**
 * Read a ref from a repository using its filename
 * @param {Repository} repo
 * @paran {String} refPath
 * @return {Promise<Ref>}
 */
Ref.readFromRepo = function(repo, refPath) {
    return repo.readGitFile(refPath)
        .then(Ref.createFromBuffer);
};

/**
 * Read a ref from a repository using its filename
 * @param {Repository} repo
 * @paran {String} refPath
 * @return {Promise<Ref>}
 */
Ref.writeToRepo = function(repo, refPath, ref) {
    return repo.writeGitFile(refPath, ref.toBuffer());
};

module.exports = Ref;
