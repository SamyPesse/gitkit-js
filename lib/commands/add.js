
function add(repo, args, opts) {
    var index = repo.StagingIndex();


    return index.parse()
    .then(function() {

    });
}

module.exports = add;
module.exports.description = 'add [file]'
module.exports.options = {};
