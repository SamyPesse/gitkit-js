var Q = require('q');

/*
    Detect if a repository is bare or not

    @param {FS}
    @return {Promise<Boolean>}
*/
function isBare(fs) {
    return fs.statFile('.git')
    .then(function() {
        return false;
    }, function() {
        return Q(true);
    });
}

module.exports = isBare;
