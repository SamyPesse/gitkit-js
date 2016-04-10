# git.js

Pure JavaScript implementation of Git backed by immutable models and promises.

### Installation

```
$ npm install <name>
```

### Command line Usage

```
# List commits on the current branch
$ gitjs log

# List entries in a tree
$ gitjs ls-tree [sha]

# Print an object (blob / tree / commit)
$ gitjs cat-file [sha]

# List all files in working directory
$ gitjs ls-files
```

### Usage

```js
var Git = require('git-js');
var NodeFS = require('git-js/lib/fs/node');

// Prepare the filesystem
var fs = NodeFS(process.cwd());

// Create a repository instance
var repo = Repository.createWithFS(fs);
```

##### Track a file

Add a file to the working index:

```js
Git.WorkingUtils.add(repo, 'README.md')
    .then(function() {
        ...
    });
```

##### List branches

List branches in the repository as a list of strings:

```js
Git.BranchUtils.list(repo)
    .then(function(branches) {
        ...
    })
```

##### Get current branch

Get name of current checkout branch:

```js
Git.BranchUtils.getCurrent(repo)
    .then(function(branchName) {
        ...
    })
```

