var GitRepo = require('../lib').Repo;
var FS = require('../lib/fs/node');

var fs = new FS(process.cwd());
var repo = new GitRepo(fs);

module.exports = repo;
