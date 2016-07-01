// @flow

var through = require('through2');
var GitObject = require('../models/object');

import type Repository from '../models/repo';

/**
 * Write a stream of GitObject to a repository
 *
 * @param {Repository}
 * @return {Stream}
 */
function writeObjectStream(
    repo: Repository
): stream$Writable {
    return through.obj(function(obj, enc, callback) {
        GitObject.writeToRepo(repo, obj)
        .nodeify(callback);
    });
}

module.exports = writeObjectStream;
