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

#### API

```js
var GitKit = require('gitkit');
var NodeFS = require('gitkit/lib/fs/node');

// Prepare the filesystem
var fs = NodeFS(process.cwd());

// Create a repository instance
var repo = GitKit.Repository.createWithFS(fs, isBare);
```

###### Clone a remote repository

```js
// Create a transport instance for the GitHub repository
var transport = new GitKit.HTTPTransport('https://github.com/GitbookIO/gitbook.git');

GitKit.TransferUtils.clone(repo, transport)
.then(function() {
    // Clone succeed!
}, function(err) {
    // Clone failed
})
```

#### Examples

| Example | Description |
| ------- | ----------- |
| [Clone](./examples/clone.js) | Clone a remote git repository |


## Thanks

To the people pointing me in the right directions like:

- [Stefan Saasen](http://stefan.saasen.me/articles/git-clone-in-haskell-from-the-bottom-up/)
- [Chris Dickinson](https://github.com/chrisdickinson)

## License

`GitKit.js` is [Apache-licensed](./LICENSE.md).
