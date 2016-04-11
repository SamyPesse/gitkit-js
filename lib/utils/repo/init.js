var Q = require('q');
var path = require('path');

var Head = require('../../models/head');

/*
    Initialize a repository as empty

    @param {Repository}
    @return {Promise<Repositroy>}
*/
function init(repo) {
    var fs = repo.getFS();
    var isBare = repo.isBare();
    var base = isBare? '' : '.git';

    var head = Head.createForRef('refs/heads/master');

    return Head.readFromRepo(repo)
    .then(function() {
        throw new Error('Directory is already a git repository');
    }, function() {
        return Q();
    })
    .then(function() {
        return fs.mkdir(base)

        // Create directories
        .then(function() {
            return Q.all([
                fs.mkdir(path.join(base, 'objects')),
                fs.mkdir(path.join(base, 'refs/heads')),
                fs.mkdir(path.join(base, 'hooks'))
            ]);
        })

        // Write files
        .then(function() {
            return Q.all([
                Head.writeToRepo(repo, head)
            ]);
        });
    });
}

module.exports = init;
