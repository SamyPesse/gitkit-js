var is = require('is');
var ignore = require('ignore');

/*
    Create a filter function

    @param {Repository} repo
    @return {Promise<Function>}
*/
function getIgnoreFilter(repo) {
    var ig = ignore();

    ig.add([
        // Skip all git files
        '.git/*',

        // Skip OS X meta data
        '.DS_Store'
    ]);

    return repo.readFile('.gitignore')
        .then(function(content) {
            ig.add(content.toString('utf8'));
            var filterPath = ig.createFilter();

            return function(file) {
                file = is.string(file)? file : file.getPath();
                return filterPath(file);
            };
        });
}

module.exports = getIgnoreFilter;
