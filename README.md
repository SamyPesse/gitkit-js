# git.js

Pure JavaScript implementation of Git backed by immutable models and promises.

## Installation

```
$ npm install <name>
```

## Command line Usage

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

## Usage

```js
var Git = require('git-js');
var NodeFS = require('git-js/lib/fs/node');

// Prepare the filesystem
var fs = NodeFS(process.cwd());

// Create a repository instance
var repo = Repository.createWithFS(fs, isBare);
```

##### Initialize a repository

```js
Git.RepoUtils.init(repo)
    .then(function() { ... });
```

### Git Databases

##### Create a blob

```js
var blob = Git.Blob.createFromString('Hello World');

// Write the blob to the disk
Git.Blob.writeToRepo(blob)
    .then(function(blobSha) { ... });
```

##### Create a tree

```js
var treeEntry = Git.TreeEntry.createForBlob('test.txt', blobSha);

var tree = Git.Tree.create([
    treeEntry
]);

// Write the tree to the disk
Git.Tree.writeToRepo(tree)
    .then(function(treeSha) { ... });
```

##### Create a commit

```js
var person = Git.Person.create('John Doe', 'john.doe@gmail.com');
var author = Git.Author.createFromPerson(person, new Date());

// Create a commit instance
var commit = Git.Commit.create({
    message: 'My first commit',
    author: author,
    committer: author,
    tree: treeSha,
    parents: []
});

// Write to the disk
Git.Commit.writeToRepo(repo, commit)
    .then(function(commitSha) { ... });
```

### Working Directory



##### Track a file

Add a file to the working index:

```js
Git.WorkingUtils.add(repo, 'README.md')
    .then(function() { ... });
```

##### List branches

List branches in the repository as a list of strings:

```js
Git.BranchUtils.list(repo)
    .then(function(branches) { ... })
```

##### Get current branch

Get name of current checkout branch:

```js
Git.BranchUtils.getCurrent(repo)
    .then(function(branchName) { ... })
```

