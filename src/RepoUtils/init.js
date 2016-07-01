var Promise = require('q');
var path = require('path');

var Head = require('../models/head');
import type Repository from '../models/repo';

/**
 * Initialize a repository as empty
 *
 * @param {Repository}
 * @return {Promise<Repositroy>}
 */
function init(
    repo: Repository
): Promise<Repository> {
    var fs = repo.getFS();
    var isBare = repo.isBare();
    var base = isBare? '' : '.git';

    var head = Head.createForRef('refs/heads/master');

    return Head.readFromRepo(repo)
    .then(function() {
        throw new Error('Directory is already a git repository');
    }, function() {
        return Promise();
    })
    .then(function() {
        return fs.mkdir(base)

        // Create directories
        .then(function() {
            return Promise.all([
                fs.mkdir(path.join(base, 'objects')),
                fs.mkdir(path.join(base, 'refs/heads')),
                fs.mkdir(path.join(base, 'hooks'))
            ]);
        })

        // Write files
        .then(function() {
            return Promise.all([
                Head.writeToRepo(repo, head)
            ]);
        });
    });
}

module.exports = init;
