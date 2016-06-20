# GitKit.js

[![NPM version](https://badge.fury.io/js/gitkit.svg)](http://badge.fury.io/js/gitkit)
[![Linux Build Status](https://travis-ci.org/SamyPesse/gitkit-js.png?branch=master)](https://travis-ci.org/SamyPesse/gitkit-js)
[![Windows Build status](https://ci.appveyor.com/api/projects/status/63nlflxcwmb2pue6?svg=true)](https://ci.appveyor.com/project/SamyPesse/gitkit-js)

Pure JavaScript implementation of Git backed by immutable models and promises.

The goal is to provide both a low and high level API for manipulating Git repositories: read files, commit changes, edit working index, clone, push, fetch, etc.

This library can work both in the browser and Node.js.

## Installation

```
$ npm install gitkit
```

## Usage

#### API Basics

State of the Git repository is represented as a single immutable `Repository` object. Read and write access to the repository is done using a `FS` driver, the implementation of the fs depends on the plaftrom (`NativeFS` for Node.js/Native, `LocalStorageFS` or `MemoryFS` for the browser).

```js
var GitKit = require('gitkit');
var NativeFS = require('gitkit/lib/fs/native');

// Prepare the filesystem
var fs = NativeFS(process.cwd());

// Create a repository instance
var repo = GitKit.Repository.createWithFS(fs, isBare);
```

##### Clone a remote repository

```js
// Create a transport instance for the GitHub repository
var transport = new GitKit.HTTPTransport('https://github.com/GitbookIO/gitbook.git');

GitKit.TransferUtils.clone(repo, transport)
.then(function(newRepo) {
    // Clone succeed!
}, function(err) {
    // Clone failed
})
```

##### List branches

`GitKit.BranchUtils.list` returns a promise listing branches as a list of strings.

```js
GitKit.BranchUtils.list(repo)
    .then(function(branches) { ... })
```

##### Get current branch

`GitKit.BranchUtils.getCurrent` returns a promise resolved with the name of the current active branch.

```js
GitKit.BranchUtils.getCurrent(repo)
    .then(function(branch) { ... })
```

##### List files in repository

`GitKit.WorkingIndex` provides a set of methods to work with the working index.

```js
GitKit.WorkingIndex.readFromRepo(repo)
    .then(function(workingIndex) {
        var entries = workingIndex.getEntries();
    });
```

##### List changes not staged for commit

`GitKit.ChangesUtils` provides a set of methods to work with pending changes.

```js
GitKit.ChangesUtils.list(repo)
    .then(function(changes) { ... });
```

##### Commit changes

```js
var author = GitKit.Person.create('Bob', 'bob@gmail.com');
var message = 'My First commit';

GitKit.CommitUtils.createForChanges(repo, author, message, changes)
    .then(function(newRepo) { ... });
```

##### More example and documentation coming soon!

I'll publish a better documentation for this library soon.

## Thanks

To the people pointing me in the right directions like:

- [Stefan Saasen](http://stefan.saasen.me/articles/git-clone-in-haskell-from-the-bottom-up/)
- [Chris Dickinson](https://github.com/chrisdickinson)

## License

`GitKit.js` is [Apache-licensed](./LICENSE.md).
