var Q = require('q');
var path = require('path');
var Immutable = require('immutable');

/*
    List all files in a repository

    @param {FS} fs
    @param {String} base
    @param {Function} filter
    @return {OrderedMap<String:File>}
*/
function list(fs, base, filter) {
    base = base || '';

    return fs.readDir(base)
        .then(function(files) {
            return files.reduce(function(prev, fileName) {
                return prev.then(function(result) {
                    var filePath = path.join(base, fileName);

                    return fs.statFile(filePath)
                    .then(function(file) {
                        if (filter && filter(file) === false) return result;

                        if (file.isDirectory()) {
                            return list(fs, filePath, filter)
                            .then(function(_files) {
                                return result.merge(_files);
                            });
                        }

                        return result.set(
                            path.relative(base, filePath),
                            file
                        );
                    });
                });
            }, Q(new Immutable.OrderedMap()));
        });
}

module.exports = list;
