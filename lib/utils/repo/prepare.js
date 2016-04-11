var Repository = require('../../models/repo');
var isBare = require('./isBare');

/*
    Prepare a repository for an fs

    @param {FS}
    @return {Promise<Repository>}
*/
function prepare(fs) {
    return isBare(fs)
    .then(function(bare) {
        return Repository.createWithFS(fs, bare);
    });
}

module.exports = prepare;
