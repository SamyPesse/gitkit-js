var fs = require('fs');
var NodeFS = require('./node');

module.exports = NodeFS.bind(null, fs);
