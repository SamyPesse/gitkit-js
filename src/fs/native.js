// @flow

var fs = require('fs');
var NodeFS = require('./node');

class NativeFS extends NodeFS {
    constructor(root: string) {
        super(fs, root)
    }
}

module.exports = NativeFS;
