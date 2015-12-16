#!/usr/bin/env node

var program = require('commander');
var pkg = require('../package.json');

program
    .version(pkg.version);

require('./log');

program.parse(process.argv);
