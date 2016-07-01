// @flow

var Promise = require('q');
import type FS from '../fs/base';

/**
 * Detect if a repository is bare or not
 *
 * @param {FS}
 * @return {Promise<Boolean>}
 */
function isBare(
    fs: FS
): Promise<boolean> {
    return fs.statFile('.git')
    .then(function() {
        return false;
    }, function() {
        return Promise(true);
    });
}

module.exports = isBare;
