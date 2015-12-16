var GitRepo = require('./lib').Repo;
var FS = require('./lib/fs');

var fs = new FS(__dirname);
var repo = new GitRepo(fs);

var log = console.log.bind(console);

repo.object('a5e766951d4255211fe34175bb14dcd90954a83b').read()
.then(log, log);

