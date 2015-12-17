var GitRepo = require('./lib').Repo;
var FS = require('./lib/fs/node');

var fs = new FS(__dirname);
var repo = new GitRepo(fs);

var log = console.log.bind(console);

var commit = repo.Commit('9e338a24037145d39696c544ed314acb29fe392f')


commit.parse()
.then(function() {
    return commit.tree.parse()
})
.then(log, log);

