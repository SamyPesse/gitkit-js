// @flow

var Repository = require('../models/repo');
var isBare = require('./isBare');

import type Promise from 'q';
import type FS from '../fs/base';

/**
 * Prepare a repository for an fs
 * @param {FS}
 * @return {Promise<Repository>}
 */
function prepare(
    fs: FS
): Promise<Repository> {
    return isBare(fs)
    .then(function(bare) {
        return Repository.createWithFS(fs, bare);
    });
}

module.exports = prepare;
