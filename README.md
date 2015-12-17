# git.js

Pure javascript implementation of Git.

- ✨ Promise based
- ✨ Node.js and Browser support
- ✨ Low-level API
- ✨ High-level API and easy to use utility methods

### Installation

```
$ npm install <name>
```

### Usage

#### Create a repository

The first step is to create a `Repo` object binded to a `FS`.

```js
var git = require('<name>');
var FS = require('<name>/lib/fs/node');

var repo = new git.Repo(FS(__dirname), {
    bare: false
});
```

#### Refs (Branches, Tags)

Refs are pointers to commits.

###### Listing refs

```js
repo.listRefs('heads')
    .then(function(refs) {
        // refs is an array of Ref objects
    })
```

`repo.listBranches()` and `repo.listTags()` are shortcuts for listing specific type of refs.

###### Update a ref

Update a reference to point to a new commit is easy (for example after creating a new commit):

```js
var master = repo.Head('refs/heads/master');

master.update(commit).then(function() { ... });
```

###### Resolve a ref to a commit

```js
master.resolveToCommit()
    .then(function(commit) {
        // commit is a Commit object
    })
```

#### Head

`HEAD` files point to the current branch in a specific context. For example `.git/HEAD` points to the branch you currently have checked out; `.git/ORIG_HEAD` points to the corresponding branch on the origin remote.

```js
// By default it will resolve to '.git/HEAD'
var head = repo.Head();

// You can specify another HEAD file
var origHead = repo.Head('ORIG_HEAD');
```

###### Resolve to a Ref

```js
head.resolve()
    .then(function(ref) {

    });
```

#### Tree

Git stores content in a manner similar to a UNIX filesystem, with trees corresponding to UNIX directory entries and blobs corresponding more or less to inodes or file contents.

```js
var tree = repo.Tree('9e338a24037145d39696c544ed314acb29fe392f');

tree.parse()
    .then(function() {
        // tree.entries is a map:
        // filename -> {mode,type,sha}
    });
```

#### Commits

###### Get a commit

```js
var commit = repo.Commit('719578e6b1d9ab03ffff60d784f5cfd0dfea4471')

commit.parse()
    .then(function() {
        // commit.email == 'samypesse@gmail.com'
        // commit.message == 'My commit message'
        // commit.parents is an array of Commit
        // commit.author and commit.committer are of type Author
    });
```

###### Create a commit

```js
var tree = repo.Tree('...');

repo.createCommit({
    author: me,
    committer: me,
    message: 'My Awesome commit',
    tree: tree
})
.then(function(commit) {
    ...
});
```

#### Author

The class `Author` is an utility to access and generate author informations

```js
var me = new git.Author({
    email: 'samypesse@gmail.com',
    name: 'Samy Pessé'
});

repo.createCommit({
    author: me,
    committer: me,
    ...
});
```

#### Utilities

###### Iterate over commits tree

`repo.forEachCommit` makes it easy to iterate over the tree of commits by fetching parents.

```js
git.utils.forEachCommit(baseCommit, function(commit) {
    console.log(commit.sha);
}, {
    limit: 100
});
```

