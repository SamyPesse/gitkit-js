var getIgnoreFilter = require('./getIgnoreFilter');
var list = require('./list');

/*
    List all files not ignored in a repository.

    @param {Repository}
    @return
*/
function listAll(repo) {
    var fs = repo.getFS();

    return getIgnoreFilter(repo)
        .then(function(filter) {
            return list(fs, '', filter);
        });
}

module.exports = listAll;
