# git.js

Pure javascript implementations of Git.

- ✨ Promise based
- ✨ Node.js and Browser support
- ✨ Low-level API
- ✨ High-level API

### Installation

```
$ npm install <name>
```

### Usage

#### Create a repository

The first step is to create a `Repo` object binded to a `FS`.

```js
var GitRepo = require('<name>').Repo;
var FS = require('<name>/lib/fs/node');

var repo = new GitRepo(FS(__dirname), {
    bare: false
});
```

#### Branches

##### Listing branches

```js
repo.listBranches()
.then(function(branches) {
    // branches is an array of Ref objects
})
```

#### Refs (Branches, Tags)

##### Listing refs

```js
repo.listRefs('heads')
.then(function(refs) {
    // refs is an array of Ref objects
})
```

`repo.listBranches` and `repo.listTags` are shortcuts for listing specific type of refs.

##### Update a ref

```js
var master = repo.Head('refs/heads/master');

master.update(commit).then(function() { ... });
```

##### Resolve a ref to a commit

```js
master.resolveToCommit()
.then(function(commit) {
    // commit is a Commit object
})
```

#### Commits


